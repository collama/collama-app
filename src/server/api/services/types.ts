import { Role as PrismaRole } from "@prisma/client"

export class Role {
  private static readonly PRIORITIES: PrismaRole[] = [
    PrismaRole.Owner,
    PrismaRole.Admin,
    PrismaRole.Writer,
    PrismaRole.Reader,
    PrismaRole.Public,
  ]

  private readonly currentPriority: number

  constructor(private readonly role: PrismaRole) {
    this.currentPriority = this.priorityOf(this.role)
  }

  priorityOf(role: PrismaRole | Role): number {
    if (role instanceof Role) {
      return Role.PRIORITIES.indexOf(role.value())
    }

    return Role.PRIORITIES.indexOf(role)
  }

  value(): PrismaRole {
    return this.role
  }

  lt(role: Role): boolean {
    const index = this.priorityOf(role)
    return index < this.currentPriority
  }

  gte(role: Role): boolean {
    return !this.lt(role)
  }
}

export const RoleOwner = new Role(PrismaRole.Owner)
export const RoleAdmin = new Role(PrismaRole.Admin)
export const RoleWriter = new Role(PrismaRole.Writer)
export const RoleReader = new Role(PrismaRole.Reader)
export const RolePublic = new Role(PrismaRole.Public)

export interface HandlePermission {
  checkFor(userId: string, role: Role): Promise<Role | null>
}
