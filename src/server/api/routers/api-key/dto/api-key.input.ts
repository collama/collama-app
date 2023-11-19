import { z } from "zod"
import { zId } from "~/common/validation"

export const CreateApiKeyInput = z.object({
  providerId: zId,
  title: z.string(),
  value: z.string(),
})

export const DeleteApiKeyInput = z.object({ id: z.string() })
