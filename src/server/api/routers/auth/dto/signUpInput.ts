import z from "zod"
import { zPassword } from "~/common/validation"

export const signUpInput = z.object({
  email: z.string().email(),
  password: zPassword,
  username: z.string(),
})
