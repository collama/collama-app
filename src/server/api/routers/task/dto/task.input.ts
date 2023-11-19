import { Role } from "@prisma/client"
import { z } from "zod"
import { TaskIdInput } from "~/server/api/middlewares/permission/task-permission"
import { WorkspaceSlugInput } from "~/server/api/middlewares/permission/workspace-permission"

export const CreateTaskInput = WorkspaceSlugInput

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

export const RemoveTaskMemberInput = z
  .object({
    memberId: z.string(),
  })
  .merge(TaskIdInput)
