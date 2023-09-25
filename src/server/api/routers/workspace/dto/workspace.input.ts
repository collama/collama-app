import z from "zod"
import { zId, zSlug } from "~/common/validation"
import { Role } from "@prisma/client"

export const CreateWorkspaceInput = z.object({
  name: zId,
})

export const InviteMemberToWorkspaceInput = z.object({
  slug: zSlug,
  email: z.string().email(),
  role: z.nativeEnum(Role),
})

export const UpdateMemberRoleInWorkspaceInput = z.object({
  id: z.string(),
  role: z.nativeEnum(Role),
})
