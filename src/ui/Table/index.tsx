"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { type ReactElement } from "react"

export type ColumnsType = {
  id: string
  title: string
  render: (value: never) => ReactElement
  //declare for filter
  type?: string
}[]

type TableProps<T> = {
  data: T[]
  columns: ColumnsType
  loading?: boolean
}

const transformToColumnDef = <T,>(columns: ColumnsType): ColumnDef<T>[] => {
  return columns.map<ColumnDef<T>>((col) => ({
    header: col.title,
    accessorKey: col.id,
    cell: (info) => {
      return col.render(info.getValue() as never)
    },
  }))
}

export function Table<T>({ data, columns, loading = false }: TableProps<T>) {
  const table = useReactTable({
    data,
    columns: transformToColumnDef<T>(columns),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full">
      <table className="shot-table w-full">
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
        {!loading && (
          <tbody>
            {table.getRowModel().flatRows.map((row) => (
              <tr key={row.id}>
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
