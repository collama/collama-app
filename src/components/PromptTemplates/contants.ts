import { z } from "zod"

export const PROMPT_FORM_NAME = "prompts"

const template = z.object({ role: z.string(), prompt: z.string() })

export type Template = z.infer<typeof template>

export const promptSchema = z.object({
  [PROMPT_FORM_NAME]: z.array(template),
})

export type PromptsTemplate = z.infer<typeof promptSchema>

export const DEFAULT_TEMPLATE: Template = { role: "user", prompt: "" }
