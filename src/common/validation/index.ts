import { z } from "zod"

export const zId = z
  .string()
  .max(20)
  .min(3)
  .refine(
    (v) => /^(\w+-)*\w+$/.test(v),
    "Name should contain only alphabets and -"
  )

export const zSlug = z
  .string()
  .max(100)
  .min(3)
  .refine(
    (v) => /^(\w+-)*\w+$/.test(v),
    "Slug should contain only alphabets and -"
  )

export const zPassword = z.string()
