import { Role as PrismaRole } from "@prisma/client"

export class Role {
  private static readonly PRIORITIES: PrismaRole[] = [
    PrismaRole.Owner,
    PrismaRole.Admin,
    PrismaRole.Writer,
    PrismaRole.Reader,
    PrismaRole.Public,
  ]

  readonly currentPriority: number

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

  in(roles: Role[]): boolean {
    for (const role of roles) {
      if (role.value() === this.role) {
        return true
      }
    }

    return false
  }
}

export const TaskOwner = new Role(PrismaRole.Owner)
export const TaskAdmin = new Role(PrismaRole.Admin)
export const TaskWriter = new Role(PrismaRole.Writer)
export const TaskReader = new Role(PrismaRole.Reader)
export const TaskPublic = new Role(PrismaRole.Public)

export const TaskProtectedManagers = [TaskOwner, TaskAdmin]
export const TaskProtectedWriters = [...TaskProtectedManagers, TaskWriter]
export const TaskProtectedReaders = [...TaskProtectedWriters, TaskReader]
