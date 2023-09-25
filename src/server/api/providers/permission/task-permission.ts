import { TaskNotFound } from "~/libs/constants/errors"
import { WorkspacePermission } from "~/server/api/providers/permission/workspace-permisison"
import { type PrismaClient } from "@prisma/client"
import { Role } from "~/server/api/providers/permission/role"

export class MembersOnTasksPermission {
  constructor(private readonly prisma: PrismaClient) {}

  async checkFor(taskId: string, userId: string): Promise<Role | null> {
    const members = await this.prisma.membersOnTasks.findMany({
      where: {
        taskId,
        userId,
      },
    })

    if (members) {
      let highestRole: Role | null = null
      for (const member of members) {
        const memberRole = new Role(member.role)
        if (!highestRole || memberRole.gte(highestRole)) {
          highestRole = memberRole
        }
      }

      return highestRole
    }

    return null
  }
}

export class TaskPermission {
  private readonly workspacePermission: WorkspacePermission
  private readonly membersOnTasksPermission: MembersOnTasksPermission

  constructor(private readonly prisma: PrismaClient) {
    this.workspacePermission = new WorkspacePermission(prisma)
    this.membersOnTasksPermission = new MembersOnTasksPermission(prisma)
  }

  async checkFor(taskSlug: string, userId: string): Promise<Role | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        slug: taskSlug,
      },
    })

    if (!task) {
      throw TaskNotFound
    }

    const taskRole = await this.membersOnTasksPermission.checkFor(
      task.id,
      userId
    )

    const workspaceRole = await this.workspacePermission.checkFor(
      task.workspaceId,
      userId
    )

    if (taskRole && workspaceRole) {
      return taskRole.gte(workspaceRole) ? taskRole : workspaceRole
    }

    if (!workspaceRole) {
      return taskRole
    }

    return workspaceRole
  }
}
