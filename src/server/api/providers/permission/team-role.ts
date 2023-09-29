import { TeamRole as PrismaTeamRole } from "@prisma/client"

export class TeamRole {
  private static readonly PRIORITIES: PrismaTeamRole[] = [
    PrismaTeamRole.Owner,
    PrismaTeamRole.Admin,
    PrismaTeamRole.Member,
  ]

  private readonly currentPriority: number

  constructor(private readonly role: PrismaTeamRole) {
    this.currentPriority = this.priorityOf(this.role)
  }

  priorityOf(role: PrismaTeamRole | TeamRole): number {
    if (role instanceof TeamRole) {
      return TeamRole.PRIORITIES.indexOf(role.value())
    }

    return TeamRole.PRIORITIES.indexOf(role)
  }

  value(): PrismaTeamRole {
    return this.role
  }

  lt(role: TeamRole): boolean {
    const index = this.priorityOf(role)
    return index < this.currentPriority
  }

  gte(role: TeamRole): boolean {
    return !this.lt(role)
  }

  in(roles: TeamRole[]): boolean {
    for (const role of roles) {
      if (role.value() === this.role) {
        return true
      }
    }

    return false
  }
}

export const TeamOwner = new TeamRole(PrismaTeamRole.Owner)
export const TeamAdmin = new TeamRole(PrismaTeamRole.Admin)
export const TeamMember = new TeamRole(PrismaTeamRole.Member)

export const TeamProtectedManagers = [TeamOwner, TeamAdmin]
export const TeamProtectedMembers = [...TeamProtectedManagers, TeamMember]
