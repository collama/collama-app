export interface PageProps<TParams, TSearchParams = Record<string, string>> {
  params: TParams
  searchParams: TSearchParams
}

export enum FilterOperator {
  And = "AND",
  Or = "OR",
}

export type Filter = {
  columns: string
  condition: string
  value: string
}

export type FilterValue = {
  list: Filter[]
  operator: FilterOperator
}

export type SortOrder = "asc" | "desc"

export type Sort = {
  columns: string
  condition: string
}

export type SortValue = {
  list: Sort[]
}
