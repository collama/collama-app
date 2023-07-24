"use client"

import {
  Cell,
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { HTMLProps, useEffect, useMemo, useRef, useState } from "react"
import cx from "classnames"
import {
  IconArrowsSort,
  IconCalendar,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconFilter,
  IconH1,
  IconTags,
  IconUser,
} from "@tabler/icons-react"
import { useClickAway } from "react-use"

interface Task {
  title: string
  tags: string[]
  owner: string
  status: string
  createdAt: string
}

const data: Task[] = [
  {
    title: "Act as an English Translator and Improver",
    tags: ["English"],
    owner: "Linh",
    status: "Enable",
    createdAt: "May 30",
  },
  {
    title: "Act as a Linux Terminal",
    tags: ["Tech", "Unix"],
    owner: "Linh",
    status: "Disable",
    createdAt: "May 30",
  },
  {
    title: "Act as position Interviewer",
    tags: ["Interview"],
    owner: "Linh",
    status: "Enable",
    createdAt: "May 30",
  },
]

type FilterItem = {
  value: string
  label: string
}

const keys: FilterItem[] = [
  { value: "title", label: "Title" },
  { value: "owner", label: "Owner" },
  { value: "createdAt", label: "Created at" },
]

const operations: FilterItem[] = [
  { value: "contains", label: "contains" },
  { value: "contains", label: "contains" },
]

const sorterByLabel = (optionA: FilterItem, optionB: FilterItem) =>
  optionA.label.localeCompare(optionB.label)

export default function Example() {
  const [selectedId, setSelectedId] = useState(-1)
  const [column, setColumn] = useState(-1)
  const [rowSelection, setRowSelection] = useState({})
  const getCellValue = (e: Cell<Task, unknown>, i: number) => {
    console.log(e)
    setSelectedId(e.row.index)
    setColumn(i)
  }

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
        size: 40,
      },
      {
        accessorKey: "title",
        id: "title",
        header: () => (
          <div className="flex flex-row items-center">
            <IconH1 size={14} color="#9ca3af" />
            <span className="ml-1.5">Title</span>
          </div>
        ),
        cell: (props: CellContext<Task, unknown>) => {
          const value = props.getValue()

          if (typeof value === "string") {
            return (
              <span className={cx("underline cursor-pointer")}>{value}</span>
            )
          }

          return value
        },
        footer: (props) => props.column.id,
        minSize: 500,
      },
      {
        accessorKey: "owner",
        id: "owner",
        header: () => (
          <div className="flex flex-row items-center">
            <IconUser size={14} color="#9ca3af" />
            <span className="ml-1.5">Owner</span>
          </div>
        ),
        footer: (props) => props.column.id,
        minSize: 100,
      },
      {
        accessorKey: "tags",
        id: "tags",
        header: () => (
          <div className="flex flex-row items-center">
            <IconTags size={16} color="#9ca3af" />
            <span className="ml-1.5">Tags</span>
          </div>
        ),
        footer: (props) => props.column.id,
        minSize: 100,
      },
      {
        accessorKey: "status",
        id: "status",
        header: () => <span>Status</span>,
        cell: (props: CellContext<Task, unknown>) => {
          const value = props.getValue()

          if (typeof value === "string") {
            return (
              <div
                className={cx(
                  "border-2 text-xs px-2 py-0.5 rounded-2xl font-bold flex-row items-center inline-flex h-[26px]",
                  {
                    "bg-green-50 text-green-600 border-green-200":
                      value === "Enable",
                    "bg-red-50 text-red-600 border-red-200":
                      value === "Disable",
                  }
                )}
              >
                {value === "Enable" ? (
                  <IconCircleCheckFilled size={16} />
                ) : (
                  <IconCircleXFilled size={16} />
                )}
                <span className="ml-1.5">{value}</span>
              </div>
            )
          }

          return value
        },
        footer: (props) => props.column.id,
        minSize: 100,
      },
      {
        accessorKey: "createdAt",
        id: "createdAt",
        header: () => (
          <div className="flex flex-row items-center">
            <IconCalendar size={14} color="#9ca3af" />
            <span className="ml-1.5">Created at</span>
          </div>
        ),
        footer: (props) => props.column.id,
        minSize: 100,
      },
    ],
    []
  )
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  })

  return (
    <div className="p-2 block max-w-full overflow-x-scroll overflow-y-hidden">
      <div className="flex flex-row mb-2">
        <div className="relative transition duration-150 ease-in-out flex flex-row mr-4 cursor-pointer hover:bg-gray-200 px-2 py-1.5 rounded-lg">
          <IconFilter size={20} color="#4b5563" />
          <span className="text-sm ml-1.5">Filter</span>

          <div className="absolute top-[30px] left-[10px] border bg-white z-50">
            <div className="flex flex-row">
              <span>Where</span>

              <Select
                data={[
                  { key: "title", value: "Title" },
                  { key: "owner", value: "Owner" },
                  { key: "createdAt", value: "Created at" },
                ]}
              />
              <Select
                data={[
                  { key: "title", value: "Title" },
                  { key: "owner", value: "Owner" },
                  { key: "createdAt", value: "Created at" },
                ]}
              />
              <input type="text" className="border" />
            </div>
            <div className="flex flex-row">
              <span>And</span>

              <Select
                data={[
                  { key: "title", value: "Title" },
                  { key: "owner", value: "Owner" },
                  { key: "createdAt", value: "Created at" },
                ]}
              />
              <Select
                data={[
                  { key: "title", value: "Title" },
                  { key: "owner", value: "Owner" },
                  { key: "createdAt", value: "Created at" },
                ]}
              />
              <input type="text" className="border" />
            </div>
            <div className="flex flex-row">
              <div>
                <span>Add filter</span>
              </div>
              <div>
                <span>Delete filter</span>
              </div>
            </div>
          </div>
        </div>

        <div className="transition duration-150 ease-in-out flex flex-row mr-4 cursor-pointer hover:bg-gray-200 px-2 py-1.5 rounded-lg">
          <IconArrowsSort size={20} color="#4b5563" />
          <span className="text-sm ml-1.5">Sort</span>
        </div>
      </div>
      <table
        className="w-full"
        style={{
          width: table.getCenterTotalSize(),
        }}
      >
        <thead className="border-t">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="flex" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    className={cx(
                      "text-left p-2 text-xs text-gray-500 font-normal flex flex-row items-center relative",
                      {
                        "border-l": header.id !== "select",
                      }
                    )}
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {/*<div*/}
                    {/*  onMouseDown={header.getResizeHandler()}*/}
                    {/*  onTouchStart={header.getResizeHandler()}*/}
                    {/*  // className={`resizer ${*/}
                    {/*  //   header.column.getIsResizing() ? "isResizing" : ""*/}
                    {/*  // }`}*/}
                    {/*  className={cx(*/}
                    {/*    "absolute top-0 bottom-0 right-0 w-[3px] h-full bg-red-400 cursor-col-resize"*/}
                    {/*  )}*/}
                    {/*/>*/}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr className={cx("flex flex-row items-center")} key={row.id}>
                {row.getVisibleCells().map((cell, i) => {
                  return (
                    <td
                      className={cx(
                        "p-2 text-sm border-b cursor-pointer h-[50px] flex flex-row",
                        {
                          "border-t": row.index === 0,
                          "border-l": cell.column.id !== "select",
                        }
                      )}
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                      onClick={() => getCellValue(cell, i)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={20}>Page Rows ({table.getRowModel().rows.length})</td>
          </tr>
        </tfoot>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[1, 2, 3].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <br />
      <div>
        {Object.keys(rowSelection).length} of{" "}
        {table.getPreFilteredRowModel().rows.length} Total Rows Selected
      </div>
    </div>
  )
}

interface SelectItem {
  key: string
  value: string
}

interface SelectProps {
  data: SelectItem[]
}

function Select(props: SelectProps) {
  const [value, setValue] = useState("")
  const [innerData, setInnerData] = useState(props.data)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="relative" onBlur={() => setSubmitted(false)}>
      <input
        type="text"
        className="border"
        value={value}
        onFocus={() => setSubmitted(true)}
        // onKeyUp={(e) => {
        //   if (e.key === "Enter") {
        //     e.preventDefault()
        //     ;(e.target as any).blur()
        //   }
        // }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && innerData.length > 0 && innerData[0]) {
            setValue(innerData[0].value)
            setInnerData(props.data)
            setSubmitted(false)
          }
        }}
        onChange={(e) => {
          setValue(e.target.value)
          setInnerData((prevState) => {
            if (e.target.value === "") return props.data
            return prevState.filter((v) =>
              v.value.toLowerCase().startsWith(e.target.value.toLowerCase())
            )
          })
        }}
      />
      {submitted && (
        <div className="absolute top-[20px] bg-white border z-50">
          {innerData.map((item) => (
            <div
              onClick={() => {
                setValue(item.value)
                setInnerData(props.data)
                setSubmitted(false)
              }}
              key={item.key}
            >
              {item.value}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  )
}
