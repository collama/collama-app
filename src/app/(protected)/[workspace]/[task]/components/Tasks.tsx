"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import urlJoin from "url-join"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "~/ui/Button"
import { Table } from "~/ui/Table"

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
      return <span className="bg-green-300">{cell as string}</span>
    },
  },
]

export const Tasks = () => {
  const params = useParams()
  const router = useRouter()

  const onDelete = (id: string) => {
    console.log(id)
  }

  const actionColumn: ColumnDef<Task> = {
    header: "Action",
    accessorKey: "id",
    cell: (info) => {
      const id = info.getValue()
      return <span onClick={() => onDelete(id as string)}>delete</span>
    },
  }

  return (
    <div>
      <div className="flex px-4 space-x-4 py-6">
        <Button
          type="primary"
          onClick={() =>
            router.push(urlJoin(params.team as string, "tasks/new"))
          }
        >
          Create new task
        </Button>
        <Button>Filter</Button>
        <Button>Sort</Button>
      </div>
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
