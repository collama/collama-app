import { ChatRole, type Message } from "@prisma/client"
import { v4 } from "uuid"
import { z } from "zod"

export const PROMPT_FORM_NAME = "prompts"

export const template = z.object({
  role: z.nativeEnum(ChatRole),
  content: z.string(),
  id: z.string(),
})

export const promptSchema = z.object({
  [PROMPT_FORM_NAME]: z.array(template),
})

export type PromptsTemplate = z.infer<typeof promptSchema>

const content = JSON.stringify({
  type: "doc",
  content: [{ type: "paragraph" }],
})

export const DEFAULT_TEMPLATE: Message = {
  role: ChatRole.User,
  content,
  id: v4(),
}
