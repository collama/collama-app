"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { type ReactElement } from "react"
import { Empty } from "~/ui/Empty"
import { Spin } from "~/ui/Spinner"

export type ColumnType<T = { [key: string]: any }> = {
  id: keyof T
  title: string
  render: (value: any, record: T) => ReactElement
  //declare for filter
  type?: string
}

type TableProps<T> = {
  data?: T[] | null
  columns: ColumnType<T>[]
  loading?: boolean
}

const transformToColumnDef = <T,>(columns: ColumnType<T>[]): ColumnDef<T>[] => {
  return columns.map<ColumnDef<T>>((col) => ({
    header: col.title,
    accessorKey: col.id,
    cell: (info) => {
      const record = info.row.original
      return col.render(info.getValue() as never, record)
    },
  }))
}

export function Table<T>({ data, columns, loading = false }: TableProps<T>) {
  const table = useReactTable({
    data: data ?? [],
    columns: transformToColumnDef<T>(columns),
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return (
      <div className="flex h-[20vh] items-center justify-center shadow">
        <Spin className="h-10 w-10" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[20vh]">
        <Empty />
      </div>
    )
  }

  return (
    <div className="w-full">
      <table className="shot-table w-full">
        <thead>
          <tr>
            {table.getFlatHeaders().map((header) => {
              return (
                <th key={header.id} className="font-medium opacity-60">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {table.getRowModel().flatRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  )
}
