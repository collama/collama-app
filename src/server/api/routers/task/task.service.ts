import slugify from "slugify"
import {
  ApiKeyNotFound,
  CanNotRemoveOwner,
  UserNotFound,
} from "~/common/errors"
import { InviteStatus, Role } from "@prisma/client"
import type { z } from "zod"
import type { Session } from "next-auth"
import {
  NoPermissionToInviteMembers,
  TaskNotFound,
} from "~/server/api/routers/task/task.error"
import type {
  CreateTaskInput,
  DeleteTaskInput,
  ExecuteTaskInput,
  GetMembersSlugInput,
  GetTaskBySlugInput,
  InviteMemberInput,
  RemoveMemberInput,
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
import type { FilterAndSortInput } from "~/server/api/routers/task/dto/task-filter.input"
import { cryptoTr } from "~/server/api/providers/crypto-provider"
import {
  TaskAdmin,
  TaskOwner,
  TaskWriter,
} from "~/server/api/providers/permission/role"

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

export const execute = async (input: z.infer<typeof ExecuteTaskInput>) => {
  const task = await prisma.task.findUnique({
    where: {
      slug: input.slug,
    },
    select: {
      prompt: true,
    },
  })

  if (!task) throw new TaskNotFound()

  const prompt = serializePrompt(task.prompt)
  const contents = getContent(prompt.content)
  const textContent = fillVariables(contents, input.variables)
  const text = getTextFromTextContent(textContent)

  // TODO: get api key
  const apiKey = await prisma.apiKey.findFirst()

  if (!apiKey) throw ApiKeyNotFound

  const provider = createProvider("openai", {
    apiKey: cryptoTr.decrypt(apiKey.value),
    model: "gpt-3.5-turbo",
  })

  return provider.completion(text)
}

export const inviteMember = async (
  prisma: ExtendedPrismaClient,
  input: z.infer<typeof InviteMemberInput>,
  session: Session
) => {
  const canAccess = await prisma.task.canUserAccess({
    slug: input.taskSlug,
    userId: session.user.id,
    allowedRoles: [TaskOwner, TaskAdmin, TaskWriter],
  })

  if (!canAccess) {
    throw new NoPermissionToInviteMembers()
  }

  return prisma.membersOnTasks.inviteMember({
    emailOrTeamName: input.emailOrTeamName,
    taskSlug: input.taskSlug,
    role: input.role,
    workspaceName: input.workspaceName,
  })
}

export const deleteById = async (input: z.infer<typeof DeleteTaskInput>) => {
  return await prisma.task.delete({
    where: {
      id: input.id,
    },
  })
}

export const removeMember = async (
  input: z.infer<typeof RemoveMemberInput>
) => {
  const member = await prisma.membersOnTasks.findFirst({
    where: {
      id: input.id,
    },
  })

  if (!member) throw UserNotFound

  if (member.role === Role.Owner) throw CanNotRemoveOwner

  return prisma.membersOnTasks.delete({
    where: {
      id: input.id,
    },
  })
}

export const getBySlug = async (
  input: z.infer<typeof GetTaskBySlugInput>,
  session: Session
) => {
  return await prisma.task.findUnique({
    where: {
      slug: input.slug,
      ownerId: session.user.id,
    },
    include: {
      owner: true,
    },
  })
}

export const getPromptVariables = async (
  input: z.infer<typeof GetTaskBySlugInput>
) => {
  const task = await prisma.task.findUnique({
    where: {
      slug: input.slug,
    },
    select: {
      prompt: true,
    },
  })

  if (!task) throw TaskNotFound

  const prompt = serializePrompt(task.prompt)

  return getVariableContents(prompt.content)
}

export const getMembers = async (
  input: z.infer<typeof GetMembersSlugInput>
) => {
  return prisma.membersOnTasks.findMany({
    where: {
      task: {
        name: input.slug,
      },
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

export const filterAndSort = async (
  input: z.infer<typeof FilterAndSortInput>
) => {
  const filters = transformFilter(input.filter as FilterValue)
  const sorts = transformSort(input.sort as SortValue)

  return prisma.task
    .paginate({
      where: {
        ...filters,
        workspace: {
          slug: input.slug,
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
