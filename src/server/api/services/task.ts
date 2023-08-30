import {
  InviteStatus,
  type MembersOnTeams,
  type Prisma,
  type PrismaClient,
  Role,
} from "@prisma/client"
import { type HandlePermission } from "~/server/api/services/types"
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { WorkspaceNotFound } from "~/common/errors"

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

export const inviteUserToTask = (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  input: { email: string; taskName: string; workspaceName: string; role: Role }
) => {
  return prisma.membersOnTasks.create({
    data: {
      user: {
        connect: {
          email: input.email,
        },
      },
      task: {
        connect: {
          name: input.taskName,
        },
      },
      workspace: {
        connect: {
          name: input.workspaceName,
        },
      },
      role: input.role,
      status: InviteStatus.Accepted,
    },
  })
}

export const inviteTeamToTask = (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  input: {
    teamName: string
    taskName: string
    workspaceName: string
    role: Role
  }
) => {
  return prisma.$transaction(async () => {
    const workspace = await prisma.workspace.findFirst({
      where: {
        name: input.workspaceName,
      },
    })

    if (!workspace) throw WorkspaceNotFound

    return prisma.membersOnTasks.create({
      data: {
        task: {
          connect: {
            name: input.taskName,
          },
        },
        team: {
          connect: {
            team_identifier: {
              name: input.teamName,
              workspaceId: workspace.id,
            },
          },
        },
        workspace: {
          connect: {
            name: input.workspaceName,
          },
        },
        role: input.role,
        status: InviteStatus.Accepted,
      },
    })
  })
}
