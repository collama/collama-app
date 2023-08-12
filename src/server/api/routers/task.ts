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
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        ownerId: ctx.session.right.userId,
      },
    })
  }),
})
