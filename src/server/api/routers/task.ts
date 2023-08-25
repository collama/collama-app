import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { zId } from "~/common/validation"
import { transformFilter, transformSort } from "~/services/prisma"
import { type FilterValue, type SortValue } from "~/common/types/props"
import type { Prompt } from "~/common/types/prompt"
import {
  callOpenAI,
  fillVariables,
  getContent,
  getTextFromContent,
  getVariableContents,
} from "~/server/api/services/task"

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
      throw new Error("workspace not found")
    }

    try {
      return ctx.prisma.task.create({
        data: {
          name: input.name,
          prompt: input.prompt,
          ownerId: ctx.session.right.userId,
          workspaceId: workspace.id,
        },
      })
    } catch (e) {
      console.log(e)
    }
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
        },
        include: { owner: true },
      })
    }),
  getAll: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        ownerId: ctx.session.right.userId,
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
      })
    )
    .query(async ({ ctx, input }) => {
      const filters = transformFilter(input.filter as FilterValue)
      const sorts = transformSort(input.sort as SortValue)

      return ctx.prisma.task.findMany({
        where: {
          ...filters,
          workspace: {
            name: input.name,
          },
        },
        orderBy: sorts,
        include: { owner: true },
      })
    }),
  getPromptVariables: protectedProcedure
    .input(
      z.object({
        name: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      const prompt = await ctx.prisma.task.findUnique({
        where: {
          name: input.name,
        },
        select: {
          prompt: true,
        },
      })

      const prompts = JSON.parse(
        prompt ? (prompt.prompt as string) : ""
      ) as Prompt

      return getVariableContents(prompts.content)
    }),
})

export const executeTask = protectedProcedure
  .input(
    z.object({
      name: zId,
      variables: z.record(z.string()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const prompt = await ctx.prisma.task.findUnique({
      where: {
        name: input.name,
      },
      select: {
        prompt: true,
      },
    })

    const prompts = JSON.parse(
      prompt ? (prompt.prompt as string) : ""
    ) as Prompt

    const contents = getContent(prompts.content)
    const textContent = fillVariables(contents, input.variables)
    const text = getTextFromContent(textContent)

    // TODO:The response can returns an array, we need to check it later
    const choices = await callOpenAI(text)

    return choices[0]?.message.content
  })
