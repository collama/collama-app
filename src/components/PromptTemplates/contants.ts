import { z } from "zod"

export const PROMPT_FORM_NAME = "prompts"

const template = z.object({ role: z.string(), prompt: z.any() })

export type PromptTemplate = z.infer<typeof template>

export const promptSchema = z.object({
  [PROMPT_FORM_NAME]: z.array(template),
})

export const DEFAULT_TEMPLATE: PromptTemplate = { role: "user", prompt: "" }
