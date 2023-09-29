import { TeamRole } from "@prisma/client"
import z from "zod"
import { zSlug } from "~/common/validation"
import {
  TeamIdInput,
  TeamSlugInput,
} from "~/server/api/middlewares/permission/team-permission"

export const CreateTeamInput = z.object({
  name: z.string(),
  description: z.string(),
  workspaceSlug: zSlug,
})

export const InviteMemberToTeamInput = z
  .object({
    email: z.string().email(),
    workspaceSlug: zSlug,
    role: z.nativeEnum(TeamRole),
  })
  .merge(TeamIdInput)

export const RemoveMemberByIdInput = z
  .object({
    memberId: z.string(),
  })
  .merge(TeamIdInput)
