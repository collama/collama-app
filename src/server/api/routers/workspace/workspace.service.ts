import type { z } from "zod"
import type {
  CreateWorkspaceInput,
  DeleteMemberOnWorkspaceByIdInput,
  GetBySlugInput,
  GetBySlugPublicInput,
  GetMemberOnWorkspaceBySlugInput,
  GetMembersOnWorkspaceInput,
  InviteMemberToWorkspaceInput,
  RemoveMemberOnWorkspaceByIdInput,
  RenameWorkspaceInput,
  UpdateMemberRoleInWorkspaceInput,
} from "~/server/api/routers/workspace/dto/workspace.input"
import {
  LastOwnerCanNotRemoved,
  MemberNotFound,
  Unauthorized,
  UserNotFound,
} from "~/libs/constants/errors"
import { InviteStatus, type Prisma, Role } from "@prisma/client"
import { CanNotRemoveOwner, WorkspaceNotFound } from "~/common/errors"
import { seedTasks } from "~/server/api/routers/seeds/workspace"
import type { Session } from "next-auth"
import { prisma } from "~/server/db"

export const createWorkspace = async (
  input: z.infer<typeof CreateWorkspaceInput>,
  session: Session
) => {
  const userId = session.user.id
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) throw UserNotFound

  const workspace = await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name: input.name,
        slug: input.name.toLowerCase(),
        ownerId: user.id,
        private: false,
      },
    })

    await tx.membersOnWorkspaces.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: Role.Owner,
        status: InviteStatus.Accepted,
      },
    })

    return workspace
  })

  if (!workspace) throw WorkspaceNotFound

  // TODO: delete it later after iml release Example Model
  const taskData = seedTasks.map<Prisma.TaskCreateManyInput>((task) => ({
    ...task,
    ownerId: userId,
    workspaceId: workspace.id,
  }))

  await prisma.task.createMany({
    data: taskData,
  })

  return workspace
}

export const renameWorkspace = async (
  input: z.infer<typeof RenameWorkspaceInput>,
  session: Session
) => {
  const userId = session.user.id
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) throw UserNotFound

  return prisma.workspace.update({
    where: {
      name: input.oldName,
      ownerId: user.id,
    },
    data: {
      name: input.newName,
    },
  })
}

export const getMembersOnWorkspace = async (
  input: z.infer<typeof GetMembersOnWorkspaceInput>,
  session: Session
) => {
  const userId = session.user.id
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw UserNotFound
  }

  return prisma.membersOnWorkspaces.findMany({
    where: {
      workspace: {
        slug: input.slug,
      },
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
export const inviteMemberToWorkspace = (
  input: z.infer<typeof InviteMemberToWorkspaceInput>
) =>
  prisma.membersOnWorkspaces.create({
    data: {
      role: input.role,
      workspace: {
        connect: {
          slug: input.workspaceSlug,
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
export const updateMemberRoleInWorkspace = async (
  input: z.infer<typeof UpdateMemberRoleInWorkspaceInput>,
  session: Session
) => {
  const member = await prisma.membersOnWorkspaces.findFirst({
    where: {
      id: input.id,
    },
  })
  if (!member) throw MemberNotFound

  const userId = session.user.id

  const owner = await prisma.membersOnWorkspaces.findFirst({
    where: {
      userId,
    },
  })

  if (!owner) throw UserNotFound
  if (owner.role !== Role.Owner) throw Unauthorized

  if (owner.role === Role.Owner) {
    const member = await prisma.membersOnWorkspaces.findUnique({
      where: {
        id: input.id,
      },
    })

    if (member?.id === userId) throw LastOwnerCanNotRemoved
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
export const removeMemberOnWorkspaceById = async (
  input: z.infer<typeof RemoveMemberOnWorkspaceByIdInput>,
  session: Session
) => {
  const userId = session.user.id

  const owner = await prisma.membersOnWorkspaces.findFirst({
    where: {
      userId,
    },
  })

  if (!owner) throw UserNotFound

  if (owner.role !== Role.Owner) throw Unauthorized

  if (owner.role === Role.Owner) {
    const member = await prisma.membersOnWorkspaces.findUnique({
      where: {
        id: input.id,
      },
    })

    if (member?.id === userId) throw Unauthorized
  }

  return prisma.membersOnWorkspaces.delete({
    where: {
      id: input.id,
    },
  })
}
export const getMemberOnWorkspaceBySlug = async (
  input: z.infer<typeof GetMemberOnWorkspaceBySlugInput>,
  session: Session
) => {
  const userId = session.user.id
  return prisma.membersOnWorkspaces.findFirst({
    where: {
      workspace: {
        slug: input.slug,
      },
      userId,
    },
  })
}
export const count = (session: Session) =>
  prisma.workspace.count({
    where: {
      ownerId: session.user.id,
    },
  })
export const getFirst = (session: Session) =>
  prisma.workspace.findFirst({
    where: {
      ownerId: session.user.id,
    },
  })
export const getBySlugPublic = (input: z.infer<typeof GetBySlugPublicInput>) => prisma.workspace.findFirst({
    where: {
      slug: input.workspaceSlug,
      private: false,
    },
  })
export const getBySlug = (
  input: z.infer<typeof GetBySlugInput>,
  session: Session
) =>
  prisma.workspace.findFirst({
    where: {
      slug: input.workspaceSlug,
      ownerId: session.user.id,
    },
  })
export const getAll = (session: Session) =>
  prisma.workspace.findMany({
    where: {
      ownerId: session.user.id,
    },
  })
export const deleteMemberOnWorkspaceById = async (
  input: z.infer<typeof DeleteMemberOnWorkspaceByIdInput>
) => {
  const member = await prisma.membersOnWorkspaces.findFirst({
    where: {
      id: input.id,
    },
    select: {
      role: true,
    },
  })

  if (!member) throw UserNotFound

  if (member.role === Role.Owner) throw CanNotRemoveOwner

  return prisma.membersOnWorkspaces.delete({
    where: {
      id: input.id,
    },
  })
}
