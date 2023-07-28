"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "~/ui/Button"
import urlJoin from "url-join"
import { Filter } from "~/ui/Table/components/Filter"
import React from "react"
import { useParams, useRouter } from "next/navigation"

type TableProps<T> = {
  data: T[]
  columns: ColumnDef<T>[]
}

export function Table<T>({ data, columns }: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const params = useParams()
  const router = useRouter()
  return (
    <div className="w-full px-4">
      <div className="flex px-4 space-x-4 py-6">
        <Button
          type="primary"
          onClick={() =>
            router.push(urlJoin(params.team as string, "tasks/new"))
          }
        >
          Create new task
        </Button>
        <Filter columns={table.getFlatHeaders()} />
        <Button>Sort</Button>
      </div>
      <table className="w-full shot-table">
        <thead>
          <tr>
            {table.getFlatHeaders().map((header) => {
              return (
                <th
                  key={header.id}
                  className="font-medium opacity-60 hover:bg-gray-50"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().flatRows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
