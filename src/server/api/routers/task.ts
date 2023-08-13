import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { zId } from "~/common/validation"

export const createTask = protectedProcedure
  .input(
    z.object({
      name: zId,
      prompt: z.string().optional(),
      workspaceName: zId,
      teamName: zId,
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
          .array(
            z.object({
              columns: z.string().nonempty(),
              condition: z.string().nonempty(),
              value: z.string(),
            })
          )
          .nullable(),
      })
    )
    .query(async ({ ctx, input }) => {
      const filters = input.filter?.reduce((previousValue, currentValue) => {
        previousValue[currentValue.columns] = {
          [currentValue.condition]: currentValue.value,
        }
        return previousValue
      }, {} as Record<string, Record<string, string>>)

      return ctx.prisma.task.findMany({
        where: filters,
        include: { owner: true },
      })
    }),
})
