import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { DynamicForm } from "~/ui/DynamicForm/DynamicForm"

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

  return (
    <div className="w-full px-4">
      <DynamicForm columns={table.getFlatHeaders()} />
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
