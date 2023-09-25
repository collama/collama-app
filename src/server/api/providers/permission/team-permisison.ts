import { type PrismaClient } from "@prisma/client"
import { TeamRole } from "~/server/api/providers/permission/team-role"

export class TeamPermission {
  constructor(private readonly prisma: PrismaClient) {}

  async checkFor(teamId: string, userId: string): Promise<TeamRole | null> {
    const team = await this.prisma.membersOnTeams.findFirst({
      where: {
        teamId,
        userId,
      },
    })

    if (!team) {
      return null
    }

    return new TeamRole(team.role)
  }
}
