import z from "zod"
import { zSlug } from "~/common/validation"
import { TeamRole } from "@prisma/client"

export const CreateTeamInput = z.object({
  name: z.string(),
  description: z.string(),
  workspaceSlug: zSlug,
})

export const InviteMemberToTeamInput = z.object({
  email: z.string().email(),
  teamSlug: z.string(),
  workspaceSlug: zSlug,
  role: z.nativeEnum(TeamRole),
})

export const TeamsOnWorkspaceInput = z.object({
  workspaceSlug: zSlug,
})

export const MembersOnTeamInput = z.object({
  teamSlug: z.string(),
  workspaceSlug: z.string(),
})

export const GetTeamBySlugInput = z.object({
  teamSlug: z.string(),
  workspaceSlug: z.string(),
})

export const DeleteTeamByIdInput = z.object({
  id: z.string(),
})

export const DeleteTeamMemberByIdInput = z.object({
  id: z.string(),
})
