import { Role, RolePublic } from "~/server/api/services/types"
import { type PrismaClient } from "@prisma/client"
import { type Prompt } from "~/common/types/prompt"
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
    role: Role | null
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
    if (!role) {
      return memberRole
    }

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

  // TODO: impl DI later
  constructor(private readonly prisma: PrismaClient) {
    this.workspacePermission = new WorkspacePermission(prisma)
    this.membersOnTasksPermission = new MembersOnTasksPermission(prisma)
  }

  async checkFor(taskId: string, userId: string): Promise<Role | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    })

    if (!task) {
      throw TaskNotFound
    }

    const memberRole = await this.membersOnTasksPermission.checkFor(
      taskId,
      userId
    )

    const workspaceRole = await this.workspacePermission.checkFor(
      task.workspaceId,
      userId,
      memberRole
    )

    if (!workspaceRole) {
      return memberRole
    }

    return workspaceRole
  }
}

export const serializePrompt = (raw: string | null) =>
  JSON.parse(raw ?? "") as Prompt
