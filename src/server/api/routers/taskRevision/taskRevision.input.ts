import { z } from "zod"
import { template } from "~/components/PromptTemplates/contants"
import { TaskRevisionSlugAndVersionInput } from "~/server/api/middlewares/permission/task-revision-permission"


export const AppendMessageInput = z
  .object({
    message:template,
  })
  .merge(TaskRevisionSlugAndVersionInput)

export const InsertMessageInput = z
  .object({
    message:template,
    index: z.number()
  })
  .merge(TaskRevisionSlugAndVersionInput)

export const UpdateMessageInput = z
  .object({
    message:template,
    index: z.number()
  })
  .merge(TaskRevisionSlugAndVersionInput)

export const RemoveMessageInput = z
  .object({
    index: z.number()
  })
  .merge(TaskRevisionSlugAndVersionInput)
