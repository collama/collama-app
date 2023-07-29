import { z } from "zod"
import { Role, InviteStatus } from "@prisma/client"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { TeamNotFound, UserNotFound, WorkspaceNotFound } from "~/common/errors"
import { zId } from "~/common/validation"

export const createTeam = protectedProcedure
  .input(
    z.object({
      teamName: zId,
      workspaceName: zId,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const email = ctx.session.right.email
    const user = await ctx.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw UserNotFound
    }

    const workspace = await ctx.prisma.workspace.findUnique({
      where: {
        name: input.workspaceName,
      },
    })

    if (!workspace) {
      throw WorkspaceNotFound
    }

    const team = await ctx.prisma.team.create({
      data: {
        name: input.teamName,
        workspaceId: workspace.id,
        ownerId: user.id,
      },
    })

    await ctx.prisma.membersOnTeams.create({
      data: {
        teamId: team.id,
        userId: team.ownerId,
        role: Role.Owner,
        status: InviteStatus.Accepted,
      },
    })

    return team
  })

export const inviteMemberToTeam = protectedProcedure
  .input(
    z.object({
      teamName: z.string().nonempty(),
      email: z.string().email(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const newMember = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
      select: {
        id: true,
      },
    })
    if (!newMember) {
      throw UserNotFound
    }

    const team = await ctx.prisma.team.findFirst({
      where: {
        name: input.teamName,
      },
      select: {
        id: true,
      },
    })
    if (!team) {
      throw TeamNotFound
    }

    await ctx.prisma.membersOnTeams.create({
      data: {
        teamId: team.id,
        userId: newMember.id,
        role: Role.Owner,
        status: InviteStatus.Pending,
      },
    })
  })

export const getMembersByTeam = protectedProcedure
  .input(
    z.object({
      team: z.string().nonempty(),
    })
  )
  .query(async ({ ctx, input }) => {
    return ctx.prisma.membersOnTeams.findMany({
      where: {
        team: {
          name: input.team,
        },
      },
      include: {
        user: true,
      },
    })
  })

export const teamRouter = createTRPCRouter({
  getMembersByTeam,
  getAll: protectedProcedure
    .input(
      z.object({
        workspaceName: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.membersOnTeams.findMany({
        where: {
          userId: ctx.session.right.userId,
          team: {
            workspace: {
              name: input.workspaceName,
            },
          },
        },
        include: {
          team: true,
        },
      })
    }),
})
