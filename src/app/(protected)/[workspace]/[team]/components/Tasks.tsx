"use client"

import React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Table } from "~/ui/Table"
import { Tag } from "~/ui/Tag"
import { IconX } from "@tabler/icons-react"

const data: Task[] = [
  {
    id: "123",
    title: "Act as an English Translator and Improver",
    tags: ["English"],
    owner: "Linh",
    status: "Enable",
    createdAt: "May 30",
  },
  {
    id: "456",
    title: "Act as a Linux Terminal",
    tags: ["Tech", "Unix"],
    owner: "Linh",
    status: "Disable",
    createdAt: "May 30",
  },
  {
    id: "789",
    title: "Act as position Interviewer",
    tags: ["Interview"],
    owner: "Linh",
    status: "Enable",
    createdAt: "May 30",
  },
]

const columns: ColumnDef<Task>[] = [
  {
    header: "Task",
    accessorKey: "title",
    id: "title",
    cell: (info) => {
      const cell = info.getValue()
      return <span key={cell as string}>{cell as string}</span>
    },
  },
  {
    header: "Owner",
    id: "user",
    accessorKey: "owner",
    cell: (info) => {
      const cell = info.getValue()
      return <span>{cell as string}</span>
    },
  },
  {
    header: "Create at",
    id: "createdAt",
    accessorKey: "createdAt",
    cell: (info) => {
      const cell = info.getValue()
      return <span>{cell as string}</span>
    },
  },
  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    cell: (info) => {
      const cell = info.getValue()
      return (
        <Tag color={cell === "Enable" ? "green" : "red"}>{cell as string}</Tag>
      )
    },
  },
]

export const Tasks = () => {
  const onDelete = (id: string) => {
    console.log(id)
  }

  const actionColumn: ColumnDef<Task> = {
    header: "Action",
    accessorKey: "id",
    cell: (info) => {
      const id = info.getValue()
      return (
        <span
          className="text-gray-400 hover:bg-gray-600 rounded-full"
          onClick={() => onDelete(id as string)}
        >
          <span>
            <IconX size={16} />
          </span>
        </span>
      )
    },
  }

  return (
    <div>
      <Table data={data} columns={[...columns, actionColumn]} />
    </div>
  )
}

interface Task {
  id: string
  title: string
  tags: string[]
  owner: string
  status: string
  createdAt: string
}
