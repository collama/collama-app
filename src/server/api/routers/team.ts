import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { zId } from "~/common/validation"
import { Role, TeamRole, InviteStatus } from "@prisma/client"

export const createTeam = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      workspaceName: zId,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    return ctx.prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: input.name,
          slug: input.name.toLowerCase(),
          description: input.description,
          workspace: {
            connect: {
              name: input.workspaceName,
            },
          },
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })

      return tx.membersOnTeams.create({
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

export const inviteMemberToTeam = protectedProcedure
  .input(
    z.object({
      email: z.string().email(),
      teamId: z.string(),
      workspaceName: zId,
      role: z.nativeEnum(TeamRole),
    })
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.membersOnTeams.create({
      data: {
        role: input.role,
        user: {
          connect: {
            email: input.email,
          },
        },
        team: {
          connect: {
            id: input.teamId,
          },
        },
        workspace: {
          connect: {
            name: input.workspaceName,
          },
        },
        status: InviteStatus.Accepted,
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
  membersOnTeam: protectedProcedure
    .input(z.object({ teamId: z.string(), workspaceName: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.membersOnTeams.findMany({
        where: {
          teamId: input.teamId,
          workspace: {
            name: input.workspaceName,
          },
        },
        include: {
          user: true,
        },
      })
    }),
})
