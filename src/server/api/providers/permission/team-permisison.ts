import {
  type MembersOnTeams,
  type PrismaClient,
  type Team,
} from "@prisma/client"
import { TeamRole } from "~/server/api/providers/permission/team-role"
import { TeamNotFound } from "~/server/errors/team.error"
import { WorkspaceNotFound } from "~/server/errors/workspace.error"

interface TeamPermissionResult {
  canAccess: (allowedRoles: TeamRole[]) => boolean
  role: TeamRole | null
  team: Team
  member: MembersOnTeams | null
}

export class TeamPermission {
  constructor(private readonly prisma: PrismaClient) {}

  async canAccessById(teamId: string, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: {
        id: teamId,
      },
    })

    if (!team) {
      throw new TeamNotFound()
    }

    return this.checkFor(team, userId)
  }

  async canAccessBySlug(
    teamSlug: string,
    workspaceSlug: string,
    userId: string
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        slug: workspaceSlug,
      },
    })

    if (!workspace) {
      throw new WorkspaceNotFound()
    }

    const team = await this.prisma.team.findUnique({
      where: {
        slug_workspaceId: {
          slug: teamSlug,
          workspaceId: workspace.id,
        },
      },
    })

    if (!team) {
      throw new TeamNotFound()
    }

    return this.checkFor(team, userId)
  }

  async checkFor(team: Team, userId: string): Promise<TeamPermissionResult> {
    const member = await this.prisma.membersOnTeams.findFirst({
      where: {
        teamId: team.id,
        userId,
      },
    })

    if (!member) {
      return {
        canAccess: () => false,
        role: null,
        team,
        member: null,
      }
    }

    const role = new TeamRole(member.role)
    return {
      canAccess: (allowedRoles: TeamRole[]) => role.in(allowedRoles),
      role,
      team,
      member,
    }
  }
}
