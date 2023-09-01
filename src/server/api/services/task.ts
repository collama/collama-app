import { Role, RolePublic } from "~/server/api/services/types"
import { type PrismaClient } from "@prisma/client"
import { Prompt } from "~/common/types/prompt"
import { TaskNotFound } from "~/libs/constants/errors"

export class CurrentUserPermission {
  constructor(private readonly prisma: PrismaClient) {}

  async checkFor(userId: string): Promise<Role | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (user) {
      return RolePublic
    }

    return null
  }
}

export class WorkspacePermission {
  constructor(private readonly prisma: PrismaClient) {}

  async checkFor(
    workspaceId: string,
    userId: string,
    role: Role
  ): Promise<Role | null> {
    const member = await this.prisma.membersOnWorkspaces.findFirst({
      where: {
        userId,
        workspaceId,
      },
    })

    if (!member) {
      return null
    }

    const memberRole = new Role(member.role)
    if (memberRole.gte(role)) {
      return memberRole
    }

    return null
  }
}

export class TeamOnTaskPermission {
  private static readonly QUERY_BATCH_SIZE = 100

  constructor(private readonly prisma: PrismaClient) {}

  async checkFor(
    taskId: string,
    userId: string,
    role: Role
  ): Promise<Role | null> {
    const teams = await this.prisma.membersOnTasks.findMany({
      where: {
        taskId,
        teamId: {
          not: null,
        },
      },
      take: TeamOnTaskPermission.QUERY_BATCH_SIZE, // TODO: improve it later
    })

    let highestRole: Role | null = null
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

      if (!member) {
        continue
      }

      const teamRole = new Role(team.role)
      if (teamRole.gte(role)) {
        if (
          highestRole === null ||
          (highestRole && teamRole.gte(highestRole))
        ) {
          highestRole = teamRole
        }
      }
    }

    return highestRole
  }
}

export class TaskPermission {
  private readonly teamOnTaskPermission: TeamOnTaskPermission
  private readonly workspacePermission: WorkspacePermission
  private readonly currentUserPermission: CurrentUserPermission

  // TODO: impl DI later
  constructor(private readonly prisma: PrismaClient) {
    this.teamOnTaskPermission = new TeamOnTaskPermission(prisma)
    this.workspacePermission = new WorkspacePermission(prisma)
    this.currentUserPermission = new CurrentUserPermission(prisma)
  }

  async checkFor(
    taskId: string,
    userId: string,
    role: Role
  ): Promise<Role | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    })

    if (!task) {
      throw TaskNotFound
    }

    if (!task.private) {
      return this.currentUserPermission.checkFor(userId)
    }

    const member = await this.prisma.membersOnTasks.findFirst({
      where: {
        taskId,
        userId,
      },
    })

    if (member) {
      const memberRole = new Role(member.role)
      if (memberRole.gte(role)) {
        return memberRole
      }
    }

    const workspaceRole = await this.teamOnTaskPermission.checkFor(
      taskId,
      userId,
      role
    )
    if (workspaceRole) {
      return workspaceRole
    }

    return this.workspacePermission.checkFor(task.workspaceId, userId, role)
  }
}

export const serializePrompt = (raw: string | null) =>
  JSON.parse(raw ?? "") as Prompt
