import { type Role } from "@prisma/client"

export interface HandlePermission {
  checkFor(userId: string, role: Role): Promise<Role | null>
}
