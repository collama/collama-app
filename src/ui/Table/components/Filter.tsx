import { Button } from "~/ui/Button"
import { Popover } from "~/ui/Popover"
import { DynamicFilterForm } from "~/ui/DynamicForm/"
import { useEffect, useState } from "react"
import { type ColumnsType } from "~/ui/Table"

export type Filter = {
  columns: string
  condition: string
  value: string
}

export function Filter({
  columns,
  setFilters,
}: {
  columns: ColumnsType
  setFilters: (filter: Filter[]) => void
}) {
  const [filter, setFilter] = useState<Filter[]>([])

  useEffect(() => {
    setFilters(filter)
  }, [filter, setFilters])

  return (
    <div>
      <Popover
        placement="bottom-start"
        content={
          <DynamicFilterForm
            columns={columns}
            setFilter={(filter) => setFilter(filter)}
          />
        }
      >
        <Button>Filter</Button>
      </Popover>
    </div>
  )
}
