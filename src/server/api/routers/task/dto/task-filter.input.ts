import { z } from "zod"
import { zSlug } from "~/common/validation"

const FilterConditionInput = z.object({
  columns: z.string().nonempty(),
  condition: z.string().nonempty(),
  value: z.string(),
})

const FilterInput = z
  .object({
    list: z.array(FilterConditionInput).nullable(),
    operator: z.string().nonempty(),
  })
  .required()

const SortConditionInput = z.object({
  columns: z.string().nonempty(),
  condition: z.string().nonempty(),
})

const SortInput = z
  .object({
    list: z.array(SortConditionInput).nullable(),
  })
  .required()

export const FilterAndSortInput = z.object({
  filter: FilterInput,
  sort: SortInput,
  workspaceSlug: zSlug,
  page: z.number(),
  limit: z.number(),
})
