import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { zId } from "~/common/validation"
import { Role } from "@prisma/client"

export const createTeam = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      workspaceName: zId,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.right.userId

    return ctx.prisma.$transaction(async () => {
      const team = await ctx.prisma.team.create({
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

      return ctx.prisma.membersOnTeams.create({
        data: {
          role: Role.Owner,
          workspace: {
            connect: {
              name: input.workspaceName,
            },
          },
          team: {
            connect: {
              id: team.id,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      })
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
