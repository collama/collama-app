import { z } from "zod"

export const VARIABLE_FORM_NAME = "variables"

export const variable = z.object({ name: z.string(), value: z.string() })

export type Variable = z.infer<typeof variable>

export const variablesSchema = z.object({
  [VARIABLE_FORM_NAME]: z.array(variable),
})

export type Variables = z.infer<typeof variablesSchema>
