import { InviteStatus, Role } from "@prisma/client"
import type { Session } from "next-auth"
import type { z } from "zod"
import {
  CanNotRemoveOwner,
  UserNotFound,
  WorkspaceNotFound,
} from "~/common/errors"
import type {
  CreateTeamInput,
  InviteMemberToTeamInput,
  MembersOnTeamInput,
  TeamsOnWorkspaceInput,
} from "~/server/api/routers/team/dto/team.input"
import {
  type DeleteTeamByIdInput,
  type GetTeamBySlugInput,
} from "~/server/api/routers/team/dto/team.input"
import { prisma } from "~/server/db"

export const createTeam = (
  input: z.infer<typeof CreateTeamInput>,
  session: Session
) =>
  prisma.$transaction(async (tx) => {
    const team = await tx.team.create({
      data: {
        name: input.name,
        slug: input.name.toLowerCase(),
        description: input.description,
        workspace: {
          connect: {
            slug: input.workspaceSlug,
          },
        },
        owner: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    await tx.membersOnTeams.create({
      data: {
        role: Role.Owner,
        workspace: {
          connect: {
            name: input.workspaceSlug,
          },
        },
        team: {
          connect: {
            id: team.id,
          },
        },
        user: {
          connect: {
            id: session.user.id,
          },
        },
        status: InviteStatus.Accepted,
      },
    })

    return team
  })

export const inviteMemberToTeam = (
  input: z.infer<typeof InviteMemberToTeamInput>
) =>
  prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.findFirst({
      where: {
        slug: input.workspaceSlug,
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
            slug: input.workspaceSlug,
          },
        },
        status: InviteStatus.Accepted,
      },
    })
  })

export const teamsOnWorkspace = (
  input: z.infer<typeof TeamsOnWorkspaceInput>
) =>
  prisma.team.findMany({
    where: {
      workspace: {
        slug: input.workspaceSlug,
      },
    },
    include: {
      owner: true,
    },
  })
export const membersOnTeam = (input: z.infer<typeof MembersOnTeamInput>) =>
  prisma.membersOnTeams.findMany({
    where: {
      team: {
        slug: input.teamSlug,
      },
      workspace: {
        slug: input.workspaceSlug,
      },
    },
    include: {
      user: true,
    },
  })

export const getTeamBySlug = async (
  input: z.infer<typeof GetTeamBySlugInput>
) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      slug: input.workspaceSlug,
    },
    select: {
      id: true,
    },
  })

  if (!workspace) throw WorkspaceNotFound

  return prisma.team.findFirst({
    where: {
      slug: input.teamSlug,
      workspaceId: workspace.id,
    },
  })
}

export const deleteTeamById = (input: z.infer<typeof DeleteTeamByIdInput>) =>
  prisma.$transaction(async (tx) => {
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

export const deleteTeamMemberById = async (
  input: z.infer<typeof DeleteTeamByIdInput>
) => {
  const member = await prisma.membersOnTeams.findFirst({
    where: {
      id: input.id,
    },
    select: {
      role: true,
    },
  })

  if (!member) throw UserNotFound

  if (member.role === Role.Owner) throw CanNotRemoveOwner

  return prisma.membersOnTeams.delete({
    where: {
      id: input.id,
    },
  })
}
