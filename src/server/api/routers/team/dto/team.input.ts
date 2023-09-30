import { TeamRole } from "@prisma/client"
import z from "zod"
import { zSlug } from "~/common/validation"
import { TeamIdInput } from "~/server/api/middlewares/permission/team-permission"
import { WorkspaceSlugInput } from "~/server/api/middlewares/permission/workspace-permission"

export const CreateTeamInput = z
  .object({
    name: z.string(),
    description: z.string(),
  })
  .merge(WorkspaceSlugInput)

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
