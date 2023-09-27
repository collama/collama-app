import { Role } from "@prisma/client"
import z from "zod"
import { zId, zSlug } from "~/common/validation"
import { WorkspaceIdInput } from "~/server/api/middlewares/permission/workspace-permission"

export const CreateWorkspaceInput = z.object({
  name: zId,
})

export const InviteMemberToWorkspaceInput = z
  .object({
    email: z.string().email(),
    role: z.nativeEnum(Role),
  })
  .merge(WorkspaceIdInput)

export const UpdateMemberRoleInWorkspaceInput = z.object({
  id: z.string(),
  role: z.nativeEnum(Role),
})
