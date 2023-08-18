import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { zId } from "~/common/validation"

export const createTeam = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      workspaceName: zId,
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.team.create({
      data: {
        name: input.name,
        description: input.description,
        workspace: {
          connect: {
            name: input.workspaceName,
          },
        },
        owner: {
          connect: {
            id: ctx.session.right.userId,
          },
        },
      },
    })
  })

export const teamRouter = createTRPCRouter({
  teamsOnWorkspace: protectedProcedure
    .input(
      z.object({
        workspaceName: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.team.findMany({
        where: {
          workspace: {
            name: input.workspaceName,
          },
        },
      })
    }),
})
