import { type HandlePermission } from "~/server/api/services/types"
import { type Role } from "@prisma/client"
import { sleep } from "~/server/api/services/common"

export class TeamPermission implements HandlePermission {
  async checkFor(userId: string, role: Role): Promise<Role | null> {
    await sleep(1)
    return null
  }
}
