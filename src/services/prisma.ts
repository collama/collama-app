import type { FilterValue, SortOrder, SortValue } from "~/common/types/props"
import { FilterOperator } from "~/common/types/props"

const addPrismaOperator = <T>(
  settings: T,
  operator: FilterOperator
): Record<FilterOperator.And, T> | Record<FilterOperator.Or, T> => {
  if (operator === FilterOperator.And) {
    return { [FilterOperator.And]: settings }
  }

  return { [FilterOperator.Or]: settings }
}

export const transformFilter = (filters: FilterValue) => {
  if (filters.list.length <= 1) {
    const firstElement = filters.list[0]

    if (!firstElement) return

    if (firstElement.columns === "owner") {
      return {
        owner: {
          is: { email: { [firstElement.condition]: firstElement.value } },
        },
      }
    }

    return {
      [firstElement.columns]: { [firstElement.condition]: firstElement.value },
    }
  }

  const res = filters.list.map((filter) => {
    if (filter.columns === "owner") {
      return {
        owner: {
          is: { email: { [filter.condition]: filter.value } },
        },
      }
    }

    return {
      [filter.columns]: { [filter.condition]: filter.value },
    }
  })

  return addPrismaOperator(res, filters.operator)
}

export const transformSort = (sorts: SortValue) => {
  if (sorts.list.length <= 1) {
    const firstElement = sorts.list[0]
    //
    if (!firstElement) return

    if (firstElement.columns === "owner") {
      return {
        [firstElement.columns]: {
          email: firstElement.condition as SortOrder,
        },
      }
    }

    return {
      [firstElement.columns]: firstElement.condition,
    }
  }

  return sorts.list.map((sort) => {
    if (sort.columns === "owner") {
      return {
        owner: {
          email: sort.condition as SortOrder,
        },
      }
    }

    return {
      [sort.columns]: sort.condition,
    }
  })
}
