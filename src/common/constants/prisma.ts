import { Role, TeamRole } from "@prisma/client"
import type { SelectOption } from "~/ui/Select"

export const TeamRoleOptions: SelectOption[] = [
  { value: TeamRole.Member },
  { value: TeamRole.Admin },
]

export const InviteRoleOptions: SelectOption[] = [
  { value: Role.Reader },
  { value: Role.Public },
  { value: Role.Writer },
  { value: Role.Admin },
]
