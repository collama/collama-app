import type { PrismaClient, Task } from "@prisma/client"
import { Role } from "~/server/api/providers/permission/role"
import { WorkspacePermission } from "~/server/api/providers/permission/workspace-permisison"
import { TaskNotFound } from "~/server/errors/task.error"

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

interface TaskPermissionResult {
  canAccess: (allowedRoles: Role[]) => boolean
  role: Role | null
  task: Task
}

export class TaskPermission {
  private readonly workspacePermission: WorkspacePermission
  private readonly membersOnTasksPermission: MembersOnTasksPermission

  constructor(private readonly prisma: PrismaClient) {
    this.workspacePermission = new WorkspacePermission(prisma)
    this.membersOnTasksPermission = new MembersOnTasksPermission(prisma)
  }

  async canAccessBySlug(
    taskSlug: string,
    workspaceSlug: string,
    userId: string
  ): Promise<TaskPermissionResult> {
    const task = await this.prisma.task.findUnique({
      where: {
        slug: taskSlug,
        workspace: {
          slug: workspaceSlug,
        },
      },
    })

    if (!task) {
      throw new TaskNotFound()
    }

    return this.checkFor(task, userId)
  }

  async canAccessById(
    id: string,
    userId: string
  ): Promise<TaskPermissionResult> {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    })

    if (!task) {
      throw new TaskNotFound()
    }

    return this.checkFor(task, userId)
  }

  async checkFor(task: Task, userId: string): Promise<TaskPermissionResult> {
    const taskRole = await this.membersOnTasksPermission.checkFor(
      task.id,
      userId
    )

    const workspaceResult = await this.workspacePermission.canAccessById(
      task.workspaceId,
      userId
    )

    if (taskRole && workspaceResult.role) {
      const workspaceRole = workspaceResult.role
      const role = taskRole.gte(workspaceRole) ? taskRole : workspaceRole
      return {
        canAccess: (allowedRoles) => role.in(allowedRoles),
        role,
        task,
      }
    }

    return {
      canAccess: () => false,
      role: null,
      task,
    }
  }
}
