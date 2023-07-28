"use client"

import { Button } from "~/ui/Button"
import { Popover } from "~/ui/Popover"
import { DynamicFilterForm } from "~/ui/DynamicForm/"
import { type Header } from "@tanstack/react-table"

export function Filter<T>({ columns }: { columns: Header<T, unknown>[] }) {
  return (
    <div>
      <Popover
        placement="bottom-start"
        content={<DynamicFilterForm columns={columns} />}
      >
        <Button>Filter</Button>
      </Popover>
    </div>
  )
}
