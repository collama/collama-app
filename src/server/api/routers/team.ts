import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { zId } from "~/common/validation"
import { InviteStatus, Role, TeamRole } from "@prisma/client"
import {
  CanNotRemoveOwner,
  UserNotFound,
  WorkspaceNotFound,
} from "~/common/errors"

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

      await tx.membersOnTeams.create({
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
          status: InviteStatus.Accepted,
        },
      })

      return team
    })
  })

export const inviteMemberToTeam = protectedProcedure
  .input(
    z.object({
      email: z.string().email(),
      teamSlug: z.string(),
      workspaceSlug: zId,
      role: z.nativeEnum(TeamRole),
    })
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.findFirst({
        where: {
          name: input.workspaceSlug,
        },
        select: {
          id: true,
        },
      })

      if (!workspace) throw WorkspaceNotFound

      return tx.membersOnTeams.create({
        data: {
          role: input.role,
          user: {
            connect: {
              email: input.email,
            },
          },
          team: {
            connect: {
              slug_workspaceId: {
                slug: input.teamSlug,
                workspaceId: workspace.id,
              },
            },
          },
          workspace: {
            connect: {
              name: input.workspaceSlug,
            },
          },
          status: InviteStatus.Accepted,
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
        include: {
          owner: true,
        },
      })
    }),
  membersOnTeam: protectedProcedure
    .input(z.object({ teamSlug: z.string(), workspaceSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.membersOnTeams.findMany({
        where: {
          team: {
            slug: input.teamSlug,
          },
          workspace: {
            name: input.workspaceSlug,
          },
        },
        include: {
          user: true,
        },
      })
    }),
  getTeamBySlug: protectedProcedure
    .input(z.object({ teamSlug: z.string(), workspaceSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.prisma.workspace.findFirst({
        where: {
          name: input.workspaceSlug,
        },
        select: {
          id: true,
        },
      })

      if (!workspace) throw WorkspaceNotFound

      return ctx.prisma.team.findFirst({
        where: {
          slug: input.teamSlug,
          workspaceId: workspace.id,
        },
      })
    }),
})

export const deleteTeam = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.$transaction(async (tx) => {
      await tx.membersOnTasks.deleteMany({
        where: {
          teamId: input.id,
        },
      })

      await tx.membersOnTeams.deleteMany({
        where: {
          teamId: input.id,
        },
      })

      return await tx.team.delete({
        where: {
          id: input.id,
        },
      })
    })
  })
export const deleteTeamMember = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const member = await ctx.prisma.membersOnTeams.findFirst({
      where: {
        id: input.id,
      },
      select: {
        role: true,
      },
    })

    if (!member) throw UserNotFound

    if (member.role === Role.Owner) throw CanNotRemoveOwner

    return ctx.prisma.membersOnTeams.delete({
      where: {
        id: input.id,
      },
    })
  })
