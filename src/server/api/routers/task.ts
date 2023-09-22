import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { zId } from "~/common/validation"
import { transformFilter, transformSort } from "~/services/prisma"
import { type FilterValue, type SortValue } from "~/common/types/props"
import {
  fillVariables,
  getContent,
  getTextFromTextContent,
  getVariableContents,
} from "~/server/api/services/prompt"
import { InviteStatus, Role } from "@prisma/client"
import {
  ApiKeyNotFound,
  CanNotRemoveOwner,
  FailedToCreateTask,
  UserNotFound,
  WorkspaceNotFound,
} from "~/common/errors"
import { serializePrompt } from "~/server/api/services/task"
import { TaskNotFound } from "~/libs/constants/errors"
import { createProvider } from "~/server/api/services/llm/llm"
import Cryptr from "cryptr"
import slugify from "slugify"
import { env } from "~/env.mjs"

const cryptr = new Cryptr(env.ENCRYPTION_KEY)
const makeSlug = (text: string): string =>
  slugify(text, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    locale: "en", // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  })

export const createTask = protectedProcedure
  .input(
    z.object({
      name: z.string().nonempty(),
      prompt: z.string().optional(),
      description: z.string().nullable(),
      workspaceName: zId,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const workspace = await ctx.prisma.workspace.findUnique({
      where: {
        name: input.workspaceName,
      },
    })

    if (!workspace) {
      throw WorkspaceNotFound
    }

    return ctx.prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          name: input.name,
          description: input.description,
          slug: makeSlug(input.name),
          prompt: input.prompt,
          ownerId: ctx.session.user.id,
          workspaceId: workspace.id,
        },
      })

      if (!task) {
        throw FailedToCreateTask
      }

      await tx.membersOnTasks.create({
        data: {
          userId: ctx.session.user.id,
          workspaceId: workspace.id,
          taskId: task.id,
          role: Role.Owner,
          status: InviteStatus.Accepted,
        },
      })

      return task
    })
  })

export const executeTask = protectedProcedure
  .input(
    z.object({
      slug: zId,
      variables: z.record(z.string()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const task = await ctx.prisma.task.findUnique({
      where: {
        slug: input.slug,
      },
      select: {
        prompt: true,
      },
    })

    if (!task) throw TaskNotFound

    const prompt = serializePrompt(task.prompt)
    const contents = getContent(prompt.content)
    const textContent = fillVariables(contents, input.variables)
    const text = getTextFromTextContent(textContent)

    // TODO: get api key

    const apiKey = await ctx.prisma.apiKey.findFirst()

    if (!apiKey) throw ApiKeyNotFound

    const provider = createProvider("openai", {
      apiKey: cryptr.decrypt(apiKey.value),
      model: "gpt-3.5-turbo",
    })

    return provider.completion(text)
  })

export const inviteMemberToTask = protectedProcedure
  .input(
    z.object({
      workspaceName: z.string(),
      taskName: z.string(),
      emailOrTeamName: z.string().email().or(z.string()),
      role: z.nativeEnum(Role),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.membersOnTasks.inviteMember({
      emailOrTeamName: input.emailOrTeamName,
      taskName: input.taskName,
      role: input.role,
      workspaceName: input.workspaceName,
    })
  })

export const deleteTask = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.$transaction(async (tx) => {
      await tx.membersOnTasks.deleteMany({
        where: {
          taskId: input.id,
        },
      })

      return tx.task.delete({
        where: {
          id: input.id,
        },
      })
    })
  })

export const deleteMemberOnTask = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const member = await ctx.prisma.membersOnTasks.findFirst({
      where: {
        id: input.id,
      },
    })

    if (!member) throw UserNotFound

    if (member.role === Role.Owner) throw CanNotRemoveOwner

    return ctx.prisma.membersOnTasks.delete({
      where: {
        id: input.id,
      },
    })
  })

export const taskRouter = createTRPCRouter({
  getBySlug: protectedProcedure
    .input(
      z.object({
        slug: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: {
          slug: input.slug,
          ownerId: ctx.session.user.id,
        },
        include: { owner: true },
      })
    }),
  getAll: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    })
  }),
  getFilter: protectedProcedure
    .input(
      z.object({
        filter: z
          .object({
            list: z
              .array(
                z.object({
                  columns: z.string().nonempty(),
                  condition: z.string().nonempty(),
                  value: z.string(),
                })
              )
              .nullable(),
            operator: z.string().nonempty(),
          })
          .required(),
        sort: z
          .object({
            list: z
              .array(
                z.object({
                  columns: z.string().nonempty(),
                  condition: z.string().nonempty(),
                })
              )
              .nullable(),
          })
          .required(),
        name: z.string(),
        page: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const filters = transformFilter(input.filter as FilterValue)
      const sorts = transformSort(input.sort as SortValue)

      return ctx.prisma.task
        .paginate({
          where: {
            ...filters,
            workspace: {
              name: input.name,
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
    }),
  getPromptVariables: protectedProcedure
    .input(
      z.object({
        slug: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
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
    }),
  getMemberOnTask: protectedProcedure
    .input(z.object({ workspaceSlug: z.string(), taskSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.membersOnTasks.findMany({
        where: {
          task: {
            name: input.taskSlug,
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
    }),
  getPublicTaskBySlug: protectedProcedure
    .input(
      z.object({
        slug: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: {
          slug: input.slug,
          private: false,
        },
        include: { owner: true },
      })
    }),
  getPromptVariablesOnPublic: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: {
          slug: input.slug,
          private: false,
        },
        select: {
          prompt: true,
        },
      })

      if (!task) throw TaskNotFound

      const prompt = serializePrompt(task.prompt)

      return getVariableContents(prompt.content)
    }),
})
