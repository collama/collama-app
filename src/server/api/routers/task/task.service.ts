import { InviteStatus, Role, type Task } from "@prisma/client"
import type { Session } from "next-auth"
import { type z } from "zod"
import type { FilterValue, SortValue } from "~/common/types/props"
import { type TaskSlugInput } from "~/server/api/middlewares/permission/task-permission"
import { type FilterAndSortInput } from "~/server/api/routers/task/dto/task-filter.input"
import type {
  CreateTaskInput,
  ExecuteTaskInput,
  InviteMemberInput,
} from "~/server/api/routers/task/dto/task.input"
import { type RemoveTaskMemberInput } from "~/server/api/routers/task/dto/task.input"
import { type WorkspaceProcedureInput } from "~/server/api/routers/workspace/workspace.service"
import { generateSlug } from "~/server/api/utils/slug"
import { type ExtendedPrismaClient } from "~/server/db"
import {
  CannotRemoveOwner,
  MemberNotFound,
  TaskNotFound,
} from "~/server/errors/task.error"
import { WorkspaceNotFound } from "~/server/errors/workspace.error"
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
  const model = await prisma.model.findFirst()

  if (!workspace) {
    throw new TaskNotFound()
  }

  if (!model) {
    throw new Error("Model not found")
  }

  const user = session.user

  return prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        ownerId: user.id,
        workspaceId: workspace.id,
        name: "untitled",
        slug: generateSlug("untitled"),
      },
    })

    if (!task) {
      throw new TaskNotFound()
    }

    const [taskRevision] = await Promise.all([
      tx.taskRevision.create({
        data: {
          version: "0.0.1",
          task: {
            connect: {
              id: task.id,
            },
          },
          workspace: {
            connect: {
              id: workspace.id,
            },
          },
          createdBy: {
            connect: {
              id: user.id,
            },
          },
          updatedBy: {
            connect: {
              id: user.id,
            },
          },
          model: {
            connect: {
              id: model.id,
            },
          },
        },
        select: {
          version: true,
        },
      }),
      tx.membersOnTasks.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          taskId: task.id,
          role: Role.Owner,
          status: InviteStatus.Accepted,
        },
      }),
    ])

    return { ...task, taskRevision }
  })
}

export const execute = async ({
  input,
  task,
  prisma,
}: TaskProcedureInput<z.infer<typeof ExecuteTaskInput>>) => {
  // const prompt = serializePrompt(taskRevision.prompt)
  // const contents = getContent(prompt.content)
  // const textContent = fillVariables(contents, input.variables)
  // const text = getTextFromTextContent(textContent)
  //
  // // TODO: get api key
  // const apiKey = await prisma.apiKey.findFirst()
  // if (!apiKey) {
  //   throw new ApiKeyNotFound()
  // }
  //
  // const provider = createProvider("openai", {
  //   apiKey: cryptoTr.decrypt(apiKey.value),
  //   model: "gpt-3.5-turbo",
  // })
  //
  // return provider.completion(text)
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
  return prisma.$transaction(async (tx) => {
    await tx.membersOnTasks.deleteMany({
      where: {
        taskId: task.id,
      },
    })

    await tx.taskRevision.deleteMany({
      where: {
        taskId: task.id,
      },
    })

    return tx.task.delete({
      where: {
        id: task.id,
      },
    })
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
  // const prompt = serializePrompt(taskRevision.prompt)
  // return getVariableContents(prompt.content)
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
  // await prisma.model.create({
  //   data: {
  //     name: "gpt-3.5-turbo-1106",
  //     providerId: "655c28d204eb87710c814e88",
  //     description:
  //       "The latest GPT-3.5 Turbo model with improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more.",
  //     context: 16385,
  //     inputPricing: {
  //       price: 0.001,
  //       tokens: 1000,
  //       unit: "$",
  //     },
  //     outputPricing: {
  //       price: 0.002,
  //       tokens: 1000,
  //       unit: "$",
  //     },
  //     parameter: {
  //       temperature: 0,
  //       frequencyPenalty: 0,
  //       presencePenalty: 0,
  //       maxTokens: 0,
  //       topP: 0,
  //       stopSequences: [],
  //       extra: {},
  //     },
  //   },
  // })
  const workspace = await prisma.workspace.findUnique({
    where: {
      slug: input.workspaceSlug,
    },
  })

  if (!workspace) {
    throw new WorkspaceNotFound()
  }

  const teams = await prisma.membersOnTeams.findMany({
    where: {
      userId: session.user.id,
      workspaceId: workspace.id,
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
      },
      orderBy: sorts,
      include: { owner: true, taskRevision: true },
    })
    .withPages({
      limit: input.limit,
      page: input.page,
      includePageCount: true,
    })
}
