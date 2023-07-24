import { z } from "zod"

export const zId = z
  .string()
  .max(20)
  .min(3)
  .refine(
    (v) => /^(\w+-)*\w+$/.test(v),
    "Name should contain only alphabets and -"
  )
