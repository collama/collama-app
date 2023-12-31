import { InviteStatus, Role, type Workspace } from "@prisma/client"
import type { Session } from "next-auth"
import type { z } from "zod"
import type { WorkspaceSlugInput } from "~/server/api/middlewares/permission/workspace-permission"
import type {
  CreateWorkspaceInput,
  InviteMemberToWorkspaceInput,
  UpdateMemberRoleInWorkspaceInput,
} from "~/server/api/routers/workspace/dto/workspace.input"
import { type RemoveWorkspaceMemberInput } from "~/server/api/routers/workspace/dto/workspace.input"
import { type ExtendedPrismaClient } from "~/server/db"
import { CannotRemoveOwner } from "~/server/errors/task.error"
import { UserNotFound } from "~/server/errors/user.error"
import {
  WorkspaceLimitReached,
  WorkspaceMemberNotFound,
  WorkspaceNotFound,
} from "~/server/errors/workspace.error"

const NUM_WORKSPACES_LIMIT = 10

export interface WorkspaceProcedureInput<T = unknown> {
  prisma: ExtendedPrismaClient
  input: T
  session: Session
  workspace: Workspace
}

export const createWorkspace = async ({
  session,
  input,
  prisma,
}: Omit<
  WorkspaceProcedureInput<z.infer<typeof CreateWorkspaceInput>>,
  "workspace"
>) => {
  const userId = session.user.id

  const totalWorkspaces = await prisma.workspace.count({
    where: {
      ownerId: userId,
    },
  })

  if (totalWorkspaces > NUM_WORKSPACES_LIMIT) {
    throw new WorkspaceLimitReached()
  }

  return prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name: input.name,
        slug: input.name.toLowerCase(),
        ownerId: userId,
        private: false,
      },
    })

    await tx.membersOnWorkspaces.create({
      data: {
        workspaceId: workspace.id,
        userId,
        role: Role.Owner,
        status: InviteStatus.Accepted,
      },
    })

    return workspace
  })
}

export const getMembersOnWorkspace = async ({
  prisma,
  workspace,
}: WorkspaceProcedureInput) => {
  return prisma.membersOnWorkspaces.findMany({
    where: {
      workspaceId: workspace.id,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  })
}
export const inviteMemberToWorkspace = ({
  input,
  prisma,
  workspace,
}: WorkspaceProcedureInput<z.infer<typeof InviteMemberToWorkspaceInput>>) => {
  return prisma.membersOnWorkspaces.create({
    data: {
      role: input.role,
      workspace: {
        connect: {
          id: workspace.id,
        },
      },
      user: {
        connect: {
          email: input.email,
        },
      },
      status: InviteStatus.Accepted,
    },
  })
}

export const updateMemberRoleInWorkspace = async ({
  prisma,
  input,
}: WorkspaceProcedureInput<
  z.infer<typeof UpdateMemberRoleInWorkspaceInput>
>) => {
  const member = await prisma.membersOnWorkspaces.findFirst({
    where: {
      id: input.id,
    },
  })

  if (!member) {
    throw new WorkspaceMemberNotFound()
  }

  return prisma.membersOnWorkspaces.update({
    where: {
      id: input.id,
    },
    data: {
      role: input.role,
    },
  })
}

export const count = ({
  session,
  prisma,
}: Pick<
  WorkspaceProcedureInput<z.infer<typeof WorkspaceSlugInput>>,
  "prisma" | "session"
>) => {
  return prisma.workspace.count({
    where: {
      ownerId: session.user.id,
    },
  })
}

export const getBySlug = ({
  prisma,
  input,
}: Pick<
  WorkspaceProcedureInput<z.infer<typeof WorkspaceSlugInput>>,
  "prisma" | "input"
>) => {
  return prisma.workspace.findFirst({
    where: {
      slug: input.slug,
    },
  })
}

export const belongToWorkspaces = async ({
  session,
  prisma,
}: Pick<WorkspaceProcedureInput, "session" | "prisma">) => {
  const members = await prisma.membersOnWorkspaces.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      workspace: true,
    },
  })

  return members.map((member) => member.workspace)
}

export const removeMemberOnWorkspaceById = async ({
  input,
  prisma,
}: WorkspaceProcedureInput<z.infer<typeof RemoveWorkspaceMemberInput>>) => {
  const member = await prisma.membersOnWorkspaces.findFirst({
    where: {
      id: input.memberId,
    },
    select: {
      role: true,
    },
  })

  if (!member) {
    throw new UserNotFound()
  }

  if (member.role === Role.Owner) {
    throw new CannotRemoveOwner()
  }

  return prisma.membersOnWorkspaces.delete({
    where: {
      id: input.memberId,
    },
  })
}
