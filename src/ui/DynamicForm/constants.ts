type Options = {
  label: string
  value: string
}

export type FilterType = "string" | "date"

const STRING_CONDITION: Options[] = [{ label: "Contains", value: "contains" }]

const DATE_CONDITION: Options[] = [
  { label: "Equals", value: "equals" },
  { label: "Less than", value: "ls" },
  { label: "Greater than", value: "gt" },
]

export const FILTER_CONDITION: Record<FilterType, Options[]> = {
  string: STRING_CONDITION,
  date: DATE_CONDITION,
}
