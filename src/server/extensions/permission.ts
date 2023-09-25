import { Prisma, type PrismaClient } from "@prisma/client"
import { TaskPermission } from "~/server/api/providers/permission/task-permission"
import { type Role } from "~/server/api/providers/permission/role"
import { TeamPermission } from "~/server/api/providers/permission/team-permisison"
import { TeamRole } from "~/server/api/providers/permission/team-role"
import { WorkspacePermission } from "~/server/api/providers/permission/workspace-permisison"

interface CanUserAccessTask {
  slug: string
  userId: string
  allowedRoles: Role[]
}

interface CanUserAccessTeam {
  slug: string
  userId: string
  allowedRoles: TeamRole[]
}

interface CanUserAccessWorkspace {
  slug: string
  userId: string
  allowedRoles: Role[]
}

export const canUserAccessTask = async (
  prisma: PrismaClient,
  data: CanUserAccessTask
) => {
  const taskPermission = new TaskPermission(prisma)
  const role = await taskPermission.checkFor(data.slug, data.userId)
  if (!role) {
    return false
  }

  return role.in(data.allowedRoles)
}
export const canUserAccessTeam = async (
  prisma: PrismaClient,
  data: CanUserAccessTeam
) => {
  const taskPermission = new TeamPermission(prisma)
  const role = await taskPermission.checkFor(data.slug, data.userId)
  if (!role) {
    return false
  }

  return role.in(data.allowedRoles)
}

export const canUserAccessWorkspace = async (
  prisma: PrismaClient,
  data: CanUserAccessWorkspace
) => {
  const taskPermission = new WorkspacePermission(prisma)
  const role = await taskPermission.checkFor(data.slug, data.userId)
  if (!role) {
    return false
  }

  return role.in(data.allowedRoles)
}

export const permissionExtension = Prisma.defineExtension((prisma) => {
  return prisma.$extends({
    model: {
      task: {
        async canUserAccess<T>(this: T, data: CanUserAccessTask) {
          return canUserAccessTask(prisma as PrismaClient, data)
        },
      },
      team: {
        async canUserAccess<T>(this: T, data: CanUserAccessTeam) {
          return canUserAccessTeam(prisma as PrismaClient, data)
        },
      },
      workspace: {
        async canUserAccess<T>(this: T, data: CanUserAccessWorkspace) {
          return canUserAccessWorkspace(prisma as PrismaClient, data)
        },
      },
    },
  })
})
