import { z } from "zod"
import { zSlug } from "~/common/validation"
import { Role } from "@prisma/client"
import { WorkspaceIdInput } from "~/server/api/middlewares/permission/workspace-permission"
import {
  TaskIdInput,
  TaskSlugInput,
} from "~/server/api/middlewares/permission/task-permission"

export const CreateTaskInput = z.object({
  name: z.string().nonempty(),
  prompt: z.string().optional(),
  description: z.string().nullable(),
  workspaceName: zSlug,
})

export const ExecuteTaskInput = z
  .object({
    variables: z.record(z.string()),
  })
  .merge(TaskIdInput)

export const InviteMemberInput = z
  .object({
    emailOrTeamName: z.string().email().or(z.string()),
    role: z.nativeEnum(Role),
  })
  .merge(TaskIdInput)

export const GetTaskBySlugInput = z
  .object({
    workspaceSlug: zSlug,
  })
  .merge(TaskSlugInput)
