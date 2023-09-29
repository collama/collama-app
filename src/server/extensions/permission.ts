import { Prisma, type PrismaClient } from "@prisma/client"
import { type Role } from "~/server/api/providers/permission/role"
import { TaskPermission } from "~/server/api/providers/permission/task-permission"
import { TeamPermission } from "~/server/api/providers/permission/team-permisison"
import { type TeamRole } from "~/server/api/providers/permission/team-role"
import { WorkspacePermission } from "~/server/api/providers/permission/workspace-permisison"

interface CanUserAccessTask {
  id?: string
  slug?: string
  workspaceSlug?: string
  userId: string
  allowedRoles: Role[]
}

interface CanUserAccessTeam {
  id?: string
  slug?: string
  workspaceSlug?: string
  userId: string
  allowedRoles: TeamRole[]
}

interface CanUserAccessWorkspace {
  id?: string
  slug?: string
  userId: string
  allowedRoles: Role[]
}

export const canUserAccessTask = async (
  prisma: PrismaClient,
  data: CanUserAccessTask
) => {
  const taskPermission = new TaskPermission(prisma)
  if (data.id !== undefined) {
    return taskPermission.canAccessById(data.id, data.userId)
  }

  if (data.slug !== undefined && data.workspaceSlug !== undefined) {
    return taskPermission.canAccessBySlug(
      data.slug,
      data.workspaceSlug,
      data.userId
    )
  }

  throw new Error("Invalid input")
}

export const canUserAccessTeam = async (
  prisma: PrismaClient,
  data: CanUserAccessTeam
) => {
  console.log("testdata", data)
  const taskPermission = new TeamPermission(prisma)
  if (data.id !== undefined) {
    return taskPermission.canAccessById(data.id, data.userId)
  }

  if (data.slug !== undefined && data.workspaceSlug !== undefined) {
    return taskPermission.canAccessBySlug(
      data.slug,
      data.workspaceSlug,
      data.userId
    )
  }

  throw new Error("Invalid input")
}

export const canUserAccessWorkspace = async (
  prisma: PrismaClient,
  data: CanUserAccessWorkspace
) => {
  const taskPermission = new WorkspacePermission(prisma)
  if (data.id !== undefined) {
    return taskPermission.canAccessById(data.id, data.userId)
  }

  if (data.slug !== undefined) {
    return taskPermission.canAccessBySlug(data.slug, data.userId)
  }

  throw new Error("Invalid input")
}

export const permissionExtension = Prisma.defineExtension((prisma) => {
  return prisma.$extends({
    model: {
      task: {
        async canUserAccess<T>(this: T, data: CanUserAccessTask) {
          const result = await canUserAccessTask(prisma as PrismaClient, data)
          return {
            canAccess: result.canAccess(data.allowedRoles),
            role: result.role,
            task: result.task,
          }
        },
      },
      team: {
        async canUserAccess<T>(this: T, data: CanUserAccessTeam) {
          const result = await canUserAccessTeam(prisma as PrismaClient, data)
          return {
            canAccess: result.canAccess(data.allowedRoles),
            role: result.role,
          }
        },
      },
      workspace: {
        async canUserAccess<T>(this: T, data: CanUserAccessWorkspace) {
          const result = await canUserAccessWorkspace(
            prisma as PrismaClient,
            data
          )
          return {
            canAccess: result.canAccess(data.allowedRoles),
            role: result.role,
            workspace: result.workspace,
          }
        },
      },
    },
  })
})
