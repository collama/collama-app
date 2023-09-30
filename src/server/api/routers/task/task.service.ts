import { InviteStatus, Role, type Task } from "@prisma/client"
import type { Session } from "next-auth"
import slugify from "slugify"
import { type z } from "zod"
import type { FilterValue, SortValue } from "~/common/types/props"
import { type TaskSlugInput } from "~/server/api/middlewares/permission/task-permission"
import { cryptoTr } from "~/server/api/providers/crypto-provider"
import { type FilterAndSortInput } from "~/server/api/routers/task/dto/task-filter.input"
import type {
  CreateTaskInput,
  ExecuteTaskInput,
  InviteMemberInput,
} from "~/server/api/routers/task/dto/task.input"
import { type RemoveTaskMemberInput } from "~/server/api/routers/task/dto/task.input"
import { type WorkspaceProcedureInput } from "~/server/api/routers/workspace/workspace.service"
import { createProvider } from "~/server/api/services/llm/llm"
import {
  fillVariables,
  getContent,
  getTextFromTextContent,
  getVariableContents,
} from "~/server/api/services/prompt"
import { serializePrompt } from "~/server/api/services/task"
import { createSlug } from "~/server/api/utils/slug"
import { type ExtendedPrismaClient } from "~/server/db"
import { ApiKeyNotFound } from "~/server/errors/api-key.error"
import {
  CannotRemoveOwner,
  MemberNotFound,
  TaskNotFound,
} from "~/server/errors/task.error"
import { transformFilter, transformSort } from "~/services/prisma"

interface TaskProcedureInput<T = unknown> {
  prisma: ExtendedPrismaClient
  input: T
  session: Session
  task: Task
}

export const create = async ({
  input,
  prisma,
  session,
}: WorkspaceProcedureInput<z.infer<typeof CreateTaskInput>>) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      slug: input.slug,
    },
  })

  if (!workspace) {
    throw new TaskNotFound()
  }

  return prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        name: input.name,
        description: input.description,
        slug: createSlug(input.name),
        prompt: input.prompt,
        ownerId: session.user.id,
        workspaceId: workspace.id,
      },
    })

    if (!task) {
      throw new TaskNotFound()
    }

    await tx.membersOnTasks.create({
      data: {
        userId: session.user.id,
        workspaceId: workspace.id,
        taskId: task.id,
        role: Role.Owner,
        status: InviteStatus.Accepted,
      },
    })

    return task
  })
}

export const execute = async ({
  input,
  task,
  prisma,
}: TaskProcedureInput<z.infer<typeof ExecuteTaskInput>>) => {
  const prompt = serializePrompt(task.prompt)
  const contents = getContent(prompt.content)
  const textContent = fillVariables(contents, input.variables)
  const text = getTextFromTextContent(textContent)

  // TODO: get api key
  const apiKey = await prisma.apiKey.findFirst()
  if (!apiKey) {
    throw new ApiKeyNotFound()
  }

  const provider = createProvider("openai", {
    apiKey: cryptoTr.decrypt(apiKey.value),
    model: "gpt-3.5-turbo",
  })

  return provider.completion(text)
}

export const inviteMember = async ({
  input,
  prisma,
  task,
}: TaskProcedureInput<z.infer<typeof InviteMemberInput>>) => {
  return prisma.membersOnTasks.inviteMember({
    emailOrTeamName: input.emailOrTeamName,
    role: input.role,
    taskId: task.id,
    workspaceId: task.workspaceId,
  })
}

export const deleteById = async ({ task, prisma }: TaskProcedureInput) => {
  return prisma.task.delete({
    where: {
      id: task.id,
    },
  })
}

export const removeMember = async ({
  input,
  prisma,
}: TaskProcedureInput<z.infer<typeof RemoveTaskMemberInput>>) => {
  const member = await prisma.membersOnTasks.findUnique({
    where: {
      id: input.memberId,
    },
  })

  if (!member) {
    throw new MemberNotFound()
  }

  if (member.role === Role.Owner) {
    throw new CannotRemoveOwner()
  }

  return prisma.membersOnTasks.delete({
    where: {
      id: input.memberId,
    },
  })
}

export const getBySlug = async ({
  session,
  task,
  prisma,
}: TaskProcedureInput<z.infer<typeof TaskSlugInput>>) => {
  return prisma.task.findFirst({
    where: {
      id: task.id,
      ownerId: session.user.id,
    },
    include: {
      owner: true,
    },
  })
}

export const getPromptVariables = ({ task }: TaskProcedureInput) => {
  const prompt = serializePrompt(task.prompt)
  return getVariableContents(prompt.content)
}

export const getMembers = async ({ task, prisma }: TaskProcedureInput) => {
  return prisma.membersOnTasks.findMany({
    where: {
      taskId: task.id,
    },
    include: {
      user: true,
      team: true,
    },
  })
}

export const filterAndSort = async ({
  input,
  session,
  prisma,
}: Omit<TaskProcedureInput<z.infer<typeof FilterAndSortInput>>, "task">) => {
  const teams = await prisma.membersOnTeams.findMany({
    where: {
      userId: session.user.id,
    },
    take: 10,
    select: {
      id: true,
    },
  })

  const filters = transformFilter(input.filter as FilterValue)
  const sorts = transformSort(input.sort as SortValue)

  return prisma.task
    .paginate({
      where: {
        ...filters,
        membersOnTasks: {
          some: {
            OR: [
              {
                userId: session.user.id,
              },
              {
                teamId: {
                  in: teams.map((team) => team.id),
                },
              },
            ],
          },
        },
      },
      orderBy: sorts,
      include: { owner: true },
    })
    .withPages({
      limit: input.limit,
      page: input.page,
      includePageCount: true,
    })
}
