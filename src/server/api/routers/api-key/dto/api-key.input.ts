import { z } from "zod"
import { Provider } from "@prisma/client"

export const CreateApiKeyInput = z.object({
  provider: z.enum([Provider.OpenAI, Provider.Cohere]),
  title: z.string().nonempty(),
  value: z.string().nonempty(),
})

export const DeleteApiKeyInput = z.object({ id: z.string() })