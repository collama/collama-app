import { type PrismaClient } from "@prisma/client"
import { Role } from "~/server/api/providers/permission/role"

export class WorkspacePermission {
  constructor(private readonly prisma: PrismaClient) {}

  async checkFor(workspaceId: string, userId: string): Promise<Role | null> {
    const member = await this.prisma.membersOnWorkspaces.findFirst({
      where: {
        userId,
        workspaceId,
      },
    })

    if (!member) {
      return null
    }

    return new Role(member.role)
  }
}
