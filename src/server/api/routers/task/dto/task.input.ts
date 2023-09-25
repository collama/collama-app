import { z } from "zod"
import { zSlug } from "~/common/validation"
import { Role } from "@prisma/client"

export const CreateTaskInput = z.object({
  name: z.string().nonempty(),
  prompt: z.string().optional(),
  description: z.string().nullable(),
  workspaceName: zSlug,
})

export const ExecuteTaskInput = z.object({
  slug: zSlug,
  variables: z.record(z.string()),
})

export const InviteMemberInput = z.object({
  workspaceName: z.string(),
  taskName: z.string(),
  emailOrTeamName: z.string().email().or(z.string()),
  role: z.nativeEnum(Role),
})

export const DeleteTaskInput = z.object({
  id: z.string(),
})

export const RemoveMemberInput = z.object({
  id: zSlug,
})

export const GetTaskBySlugInput = z.object({
  slug: zSlug,
})

export const GetMembersSlugInput = z.object({
  slug: zSlug,
  workspaceSlug: zSlug,
})
