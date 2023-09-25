import slugify from "slugify"
import { InviteStatus, Role, type Task } from "@prisma/client"
import { type z } from "zod"
import type { Session } from "next-auth"
import type {
  CreateTaskInput,
  ExecuteTaskInput,
  InviteMemberInput,
} from "~/server/api/routers/task/dto/task.input"
import type {
  GetMembersSlugInput,
  GetTaskBySlugInput,
} from "~/server/api/routers/task/dto/task.input"
import { serializePrompt } from "~/server/api/services/task"
import {
  fillVariables,
  getContent,
  getTextFromTextContent,
  getVariableContents,
} from "~/server/api/services/prompt"
import { createProvider } from "~/server/api/services/llm/llm"
import { type ExtendedPrismaClient, prisma } from "~/server/db"
import { transformFilter, transformSort } from "~/services/prisma"
import type { FilterValue, SortValue } from "~/common/types/props"
import { cryptoTr } from "~/server/api/providers/crypto-provider"
import { MemberNotFound, TaskNotFound } from "~/server/errors/task.error"
import { ApiKeyNotFound } from "~/server/errors/api-key.error"
import { type FilterAndSortInput } from "~/server/api/routers/task/dto/task-filter.input"

interface TaskProcedureInput<T = unknown> {
  prisma: ExtendedPrismaClient
  input: T
  session: Session
  task: Task
}

const createSlug = (text: string): string => {
  return slugify(text, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    locale: "en", // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  })
}

export const create = async (
  input: z.infer<typeof CreateTaskInput>,
  session: Session
) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      name: input.workspaceName,
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
}: TaskProcedureInput<z.infer<typeof InviteMemberInput>>) => {
  return prisma.membersOnTasks.inviteMember({
    emailOrTeamName: input.emailOrTeamName,
    taskSlug: input.slug,
    role: input.role,
    workspaceSlug: input.workspaceSlug,
  })
}

export const deleteById = async ({ task }: TaskProcedureInput) => {
  return prisma.task.delete({
    where: {
      id: task.id,
    },
  })
}

export const removeMember = async ({ task }: TaskProcedureInput) => {
  const member = await prisma.membersOnTasks.findFirst({
    where: {
      id: task.id,
    },
  })

  if (!member) {
    throw new MemberNotFound()
  }

  return prisma.membersOnTasks.delete({
    where: {
      id: member.id,
    },
  })
}

export const getBySlug = async ({
  session,
  task,
}: TaskProcedureInput<z.infer<typeof GetTaskBySlugInput>>) => {
  return prisma.task.findUnique({
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

export const getMembers = async ({
  input,
  task,
}: TaskProcedureInput<z.infer<typeof GetMembersSlugInput>>) => {
  return prisma.membersOnTasks.findMany({
    where: {
      taskId: task.id,
      workspace: {
        name: input.workspaceSlug,
      },
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
          every: {
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
