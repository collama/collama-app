import { type ReactElement } from "react"
import { type FilterConditionProps } from "~/ui/Filter/FilterCondition"

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
