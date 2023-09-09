import { Button } from "~/ui/Button"
import { Popover } from "~/ui/Popover"
import { type ColumnType } from "~/ui/Table"
import { type SortValue } from "~/common/types/props"
import { SortForm } from "~/ui/Sort/SortForm"
import { useState } from "react"

export function Sort({
  columns,
  setSorts,
  defaultSort,
}: {
  columns: ColumnType[]
  setSorts: (sort: SortValue) => void
  defaultSort: SortValue
}) {
  const [open, setOpen] = useState(false)
  const onSubmit = (sort: SortValue) => {
    setSorts(sort)
    setOpen(false)
  }

  return (
    <div>
      <Popover
        placement="bottom-start"
        content={
          <SortForm
            defaultValue={defaultSort}
            columns={columns}
            setSort={onSubmit}
          />
        }
        open={open}
        onOpenChange={() => setOpen(!open)}
      >
        <Button>
          <span>Sort</span>
          {defaultSort.list.length > 0 && (
            <span className="px-0.5 text-yellow-500">
              {`(${defaultSort?.list.length})`}
            </span>
          )}
        </Button>
      </Popover>
    </div>
  )
}
