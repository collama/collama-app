import {
  DateCondition,
  FilterCondition,
  type FilterConditionProps,
  StringCondition,
} from "~/ui/Filter/FilterCondition"
import { type ReactElement } from "react"

export const FILTER_FORM_NAME = "filter"

export type Option = {
  label: string
  value: string
}

export type FilterType = "string" | "date" | "boolean"

export const STRING_CONDITION: Option[] = [
  { label: "Contains", value: "contains" },
]

export const DATE_CONDITION: Option[] = [
  { label: "Equals", value: "equals" },
  { label: "Less than", value: "ls" },
  { label: "Greater than", value: "gt" },
]
export const BOOLEAN_CONDITION: Option[] = [
  { label: "True", value: "true" },
  { label: "False", value: "false" },
]

export const FILTER_CONDITIONS: Record<
  FilterType,
  (p: FilterConditionProps) => ReactElement
> = {
  string: StringCondition,
  date: DateCondition,
  boolean: FilterCondition,
}
