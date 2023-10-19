import { ChatRole } from "@prisma/client"
import { z } from "zod"

export const EXECUTE_FROM_NAME = "execute"

const field = z.object({ role: z.nativeEnum(ChatRole), content: z.string() })

export type Field = z.infer<typeof field>

export const executeSchema = z.object({
  [EXECUTE_FROM_NAME]: z.array(field),
})

export type ExecuteDto = z.infer<typeof executeSchema>

export const USER_FIElD: Field = { role: ChatRole.User, content: "" }
