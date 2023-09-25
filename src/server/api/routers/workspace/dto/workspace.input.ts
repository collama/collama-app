import z from "zod"
import { zSlug } from "~/common/validation"
import { Role } from "@prisma/client"

export const CreateWorkspaceInput = z.object({
  name: zSlug,
})

export const RenameWorkspaceInput = z.object({
  oldName: zSlug,
  newName: zSlug,
})

export const GetMembersOnWorkspaceInput = z.object({
  slug: zSlug,
})

export const InviteMemberToWorkspaceInput = z.object({
  workspaceSlug: zSlug,
  email: z.string().email(),
  role: z.nativeEnum(Role),
})

export const UpdateMemberRoleInWorkspaceInput = z.object({
  id: z.string(),
  role: z.nativeEnum(Role),
})

export const RemoveMemberOnWorkspaceByIdInput = z.object({
  id: z.string(),
})

export const GetMemberOnWorkspaceBySlugInput = z.object({
  slug: zSlug,
})

export const DeleteMemberOnWorkspaceByIdInput = z.object({ id: z.string() })

export const GetBySlugPublicInput = z.object({
  workspaceSlug: zSlug,
})

export const GetBySlugInput = z.object({
  workspaceSlug: zSlug,
})
