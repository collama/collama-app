import { useState } from "react"
import { type FilterValue } from "~/common/types/props"
import { Button } from "~/ui/Button"
import { FilterForm } from "~/ui/Filter/FilterForm"
import { Popover } from "~/ui/Popover"
import { type ColumnType } from "~/ui/Table"

export function Filter({
  columns,
  setFilters,
  defaultFilter,
}: {
  columns: ColumnType[]
  setFilters: (filter: FilterValue) => void
  defaultFilter: FilterValue
}) {
  const [open, setOpen] = useState(false)
  const onSubmit = (filter: FilterValue) => {
    setFilters(filter)
    setOpen(false)
  }

  return (
    <div>
      <Popover
        placement="bottom-start"
        content={
          <FilterForm
            columns={columns}
            setFilter={onSubmit}
            defaultValue={defaultFilter}
          />
        }
        open={open}
        onOpenChange={() => setOpen(!open)}
      >
        <Button>
          <span>Filter</span>
          {defaultFilter.list.length > 0 && (
            <span className="px-0.5 text-yellow-500">
              {`(${defaultFilter?.list.length})`}
            </span>
          )}
        </Button>
      </Popover>
    </div>
  )
}
