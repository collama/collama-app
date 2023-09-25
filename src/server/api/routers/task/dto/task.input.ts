import { z } from "zod"
import { zId } from "~/common/validation"
import { Role } from "@prisma/client"

export const CreateTaskInput = z.object({
  name: z.string().nonempty(),
  prompt: z.string().optional(),
  description: z.string().nullable(),
  workspaceName: zId,
})

export const ExecuteTaskInput = z.object({
  slug: zId,
  variables: z.record(z.string()),
})

export const InviteMemberInput = z.object({
  workspaceName: z.string(),
  taskSlug: z.string(),
  emailOrTeamName: z.string().email().or(z.string()),
  role: z.nativeEnum(Role),
})

export const DeleteTaskInput = z.object({
  slug: zId,
})

export const RemoveMemberInput = z.object({
  id: zId,
})

export const GetTaskBySlugInput = z.object({
  slug: zId,
})

export const GetMembersSlugInput = z.object({
  slug: zId,
  workspaceSlug: zId,
})
