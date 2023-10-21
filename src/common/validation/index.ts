import { z } from "zod"
import { slugMaxSize } from "~/server/api/utils/slug"

export const zId = z
  .string()
  .max(30)
  .min(3)
  .refine(
    (v) => /^(\w+-)*\w+$/.test(v),
    "Name should contain only alphabets and -"
  )

export const zSlug = z
  .string()
  .max(slugMaxSize)
  .min(3)
  .refine(
    (v) => /^(\w+-)*\w+$/.test(v),
    "Slug should contain only alphabets and -"
  )

export const zVersion = z.string()

export const zPassword = z.string()
