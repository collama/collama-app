import { type MembersOnTeams, type PrismaClient, Role } from "@prisma/client"
import { HandlePermission } from "~/server/api/services/types"

export const TaskNotFound = new Error("task not found")

export class TaskPermission implements HandlePermission {
  private static readonly QUERY_BATCH_SIZE = 100

  constructor(
    private readonly prisma: PrismaClient,
    private readonly taskId: string
  ) {}

  async checkFor(userId: string, role: Role): Promise<Role | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: this.taskId,
      },
    })

    if (!task) {
      throw TaskNotFound
    }

    if (!task.private) {
      return this.currentExecutor(userId)
    }

    const member = await this.prisma.membersOnTasks.findFirst({
      where: {
        taskId: this.taskId,
        userId,
      },
    })

    if (member && member.role === role) {
      return member.role
    }

    for await (const member of this.checkTeamOnWorkspacePermission(userId)) {
      if (member && member.role === role) {
        return member.role
      }
    }

    return this.checkMemberOnWorkspace(task.workspaceId, userId)
  }

  private async currentExecutor(userId: string): Promise<Role | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (user) return Role.Public

    return null
  }

  private async *checkTeamOnWorkspacePermission(
    userId: string
  ): AsyncGenerator<MembersOnTeams> {
    const teams = await this.prisma.membersOnTasks.findMany({
      where: {
        taskId: this.taskId,
        teamId: {
          not: null,
        },
      },
      take: TaskPermission.QUERY_BATCH_SIZE, // TODO: improve it later
    })

    for await (const team of teams) {
      if (!team.teamId) {
        continue
      }

      const member = await this.prisma.membersOnTeams.findFirst({
        where: {
          teamId: team.teamId,
          userId,
        },
      })

      if (member) {
        yield member
      }
    }
  }

  private async checkMemberOnWorkspace(
    workspaceId: string,
    userId: string
  ): Promise<Role | null> {
    const member = await this.prisma.membersOnWorkspaces.findFirst({
      where: {
        userId,
        workspaceId,
      },
    })

    if (member) return member.role

    return null
  }
}
