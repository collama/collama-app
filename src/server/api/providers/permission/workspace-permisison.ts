import type { PrismaClient, Workspace } from "@prisma/client"
import { Role } from "~/server/api/providers/permission/role"
import { WorkspaceNotFound } from "~/server/errors/workspace.error"

interface WorkspacePermissionResult {
  canAccess: (allowedRoles: Role[]) => boolean
  role: Role | null
  workspace: Workspace
}

export class WorkspacePermission {
  constructor(private readonly prisma: PrismaClient) {}

  async canAccessBySlug(
    slug: string,
    userId: string
  ): Promise<WorkspacePermissionResult> {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        slug,
      },
    })

    if (!workspace) {
      throw new WorkspaceNotFound()
    }

    return this.checkFor(workspace, userId)
  }

  async canAccessById(
    id: string,
    userId: string
  ): Promise<WorkspacePermissionResult> {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id,
      },
    })

    if (!workspace) {
      throw new WorkspaceNotFound()
    }

    return this.checkFor(workspace, userId)
  }

  async checkFor(
    workspace: Workspace,
    userId: string
  ): Promise<WorkspacePermissionResult> {
    const member = await this.prisma.membersOnWorkspaces.findFirst({
      where: {
        userId,
        workspaceId: workspace.id,
      },
    })

    if (!member) {
      return {
        canAccess: () => false,
        role: null,
        workspace,
      }
    }

    const role = new Role(member.role)
    return {
      canAccess: (allowedRoles: Role[]) => role.in(allowedRoles),
      role,
      workspace,
    }
  }
}
