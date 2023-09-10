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
import { FailedToCreateTask, WorkspaceNotFound } from "~/common/errors"
import { serializePrompt } from "~/server/api/services/task"
import { TaskNotFound } from "~/libs/constants/errors"
import { createProvider } from "~/server/api/services/llm/llm"
import { env } from "~/env.mjs"

export const createTask = protectedProcedure
  .input(
    z.object({
      name: zId,
      prompt: z.string().optional(),
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

    return ctx.prisma.$transaction(async () => {
      return ctx.prisma.$transaction(async (tx) => {
        const task = await tx.task.create({
          data: {
            name: input.name,
            slug: input.name.toLowerCase(),
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
  })

export const executeTask = protectedProcedure
  .input(
    z.object({
      name: zId,
      variables: z.record(z.string()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const task = await ctx.prisma.task.findUnique({
      where: {
        name: input.name,
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

    const provider = createProvider("openai", {
      apiKey: env.OPENAI_KEY,
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

export const taskRouter = createTRPCRouter({
  getByName: protectedProcedure
    .input(
      z.object({
        name: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: {
          name: input.name,
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
        limit: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const filters = transformFilter(input.filter as FilterValue)
      const sorts = transformSort(input.sort as SortValue)

      return ctx.prisma.task.paginate({
        where: {
          ...filters,
          workspace: {
            name: input.name,
          },
        },
        orderBy: sorts,
        include: { owner: true },
      }).withPages({
        limit: input.limit,
        page: input.page,
        includePageCount: true,
      })
    }),
  getPromptVariables: protectedProcedure
    .input(
      z.object({
        name: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: {
          name: input.name,
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

export const deleteTask = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.$transaction(async (tx) => {
      await tx.membersOnTasks.deleteMany({
        where: {
          taskId: input.id
        },
      })

      return tx.task.delete({
        where: {
          id: input.id,
        },
      })
    })
  })
