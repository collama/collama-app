import { InviteStatus, Role } from "@prisma/client"
import type { Session } from "next-auth"
import type { z } from "zod"
import {
  type TeamIdInput,
  type TeamSlugInput,
} from "~/server/api/middlewares/permission/team-permission"
import { type WorkspaceSlugInput } from "~/server/api/middlewares/permission/workspace-permission"
import type {
  CreateTeamInput,
  InviteMemberToTeamInput,
} from "~/server/api/routers/team/dto/team.input"
import { type RemoveMemberByIdInput } from "~/server/api/routers/team/dto/team.input"
import { type WorkspaceProcedureInput } from "~/server/api/routers/workspace/workspace.service"
import { createSlug } from "~/server/api/utils/slug"
import { type ExtendedPrismaClient } from "~/server/db"
import {
  CannotRemoveTeamOwner,
  TeamMemberNotFound,
} from "~/server/errors/team.error"
import { UserNotFound } from "~/server/errors/user.error"
import {
  WorkspaceMemberNotFound,
  WorkspaceNotFound,
} from "~/server/errors/workspace.error"

export interface TeamProcedureInput<T = unknown> {
  prisma: ExtendedPrismaClient
  input: T
  session: Session
}

export const createTeam = ({
  input,
  prisma,
  session,
}: WorkspaceProcedureInput<z.infer<typeof CreateTeamInput>>) => {
  return prisma.$transaction(async (tx) => {
    const team = await tx.team.create({
      data: {
        name: input.name,
        slug: createSlug(input.name),
        description: input.description,
        workspace: {
          connect: {
            slug: input.slug,
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
            name: input.slug,
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
}

export const inviteMemberToTeam = ({
  input,
  prisma,
}: TeamProcedureInput<z.infer<typeof InviteMemberToTeamInput>>) => {
  return prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.findFirst({
      where: {
        slug: input.workspaceSlug,
      },
      select: {
        id: true,
      },
    })

    if (!workspace) throw new WorkspaceNotFound()

    const user = await tx.user.findUnique({
      where: {
        email: input.email,
      },
    })

    if (!user) throw new UserNotFound()

    const member = await tx.membersOnWorkspaces.findFirst({
      where: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    })

    if (!member) throw new WorkspaceMemberNotFound()

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
            id: input.id,
          },
        },
        workspace: {
          connect: {
            id: workspace.id,
          },
        },
        status: InviteStatus.Accepted,
      },
    })
  })
}

export const getTeamsByWorkspaceSlug = ({
  input,
  prisma,
}: TeamProcedureInput<z.infer<typeof WorkspaceSlugInput>>) => {
  return prisma.team.findMany({
    where: {
      workspace: {
        slug: input.slug,
      },
    },
    include: {
      owner: true,
    },
  })
}

export const getMembersByTeamId = ({
  input,
  prisma,
}: TeamProcedureInput<z.infer<typeof TeamIdInput>>) => {
  return prisma.membersOnTeams.findMany({
    where: {
      teamId: input.id,
    },
    include: {
      user: true,
    },
  })
}

export const getTeamBySlug = async ({
  input,
  prisma,
}: TeamProcedureInput<z.infer<typeof TeamSlugInput>>) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      slug: input.workspaceSlug,
    },
    select: {
      id: true,
    },
  })

  if (!workspace) throw new WorkspaceNotFound()

  return prisma.team.findUnique({
    where: {
      slug_workspaceId: {
        slug: input.slug,
        workspaceId: workspace.id,
      },
    },
  })
}

export const deleteTeamById = ({
  input,
  prisma,
}: TeamProcedureInput<z.infer<typeof TeamIdInput>>) =>
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

    return tx.team.delete({
      where: {
        id: input.id,
      },
    })
  })

export const removeMemberById = async ({
  input,
  prisma,
}: TeamProcedureInput<z.infer<typeof RemoveMemberByIdInput>>) => {
  const member = await prisma.membersOnTeams.findFirst({
    where: {
      id: input.memberId,
    },
    select: {
      role: true,
    },
  })

  if (!member) throw new TeamMemberNotFound()

  if (member.role === Role.Owner) throw new CannotRemoveTeamOwner()

  return prisma.membersOnTeams.delete({
    where: {
      id: input.memberId,
    },
  })
}
