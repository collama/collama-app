"use client"

import React, { useState } from "react"
import { type ColumnsType, Table } from "~/ui/Table"
import { Tag } from "~/ui/Tag"
import { IconX } from "@tabler/icons-react"
import type { Task, User } from "@prisma/client"
import { api } from "~/trpc/client"
import { toFullDate } from "~/ults/datetime"
import { Button } from "~/ui/Button"
import urlJoin from "url-join"
import { Filter } from "~/ui/Table/components/Filter"
import { useParams, useRouter } from "next/navigation"
import useAsyncEffect from "use-async-effect"
import { NoSsrWarp } from "~/components/NoSsr"
import { Pagination } from "~/ui/Pagination"

const columns: ColumnsType = [
  {
    id: "name",
    title: "Task",
    type: "string",
    render: (name: string) => <span>{name}</span>,
  },
  {
    id: "owner",
    title: "Owner",
    type: "string",
    render: (user: User) => <span>{user.email}</span>,
  },
  {
    id: "createdAt",
    title: "Created At",
    type: "date",
    render: (date: Date) => <span>{toFullDate(date)}</span>,
  },
  {
    id: "private",
    title: "Private",
    type: "string",
    render: (isPrivate: boolean) => (
      <Tag color={isPrivate ? "green" : "red"}>{isPrivate.toString()}</Tag>
    ),
  },
]

export function Tasks() {
  const [filter, setFilter] = useState<Filter[]>([])
  const [data, setData] = useState<Task[]>([])
  const params = useParams()
  const router = useRouter()

  useAsyncEffect(async () => {
    const task = await api.task?.getFilter.query({ filter: filter })
    setData(task)
  }, [filter.length])

  const onDelete = (id: string) => {
    console.log(id)
  }

  const actionColumn: ColumnsType = [
    {
      title: "Action",
      id: "id",
      render: (id) => (
        <span
          className="rounded-full text-gray-400 hover:bg-gray-600"
          onClick={() => onDelete(id as string)}
        >
          <span>
            <IconX size={16} />
          </span>
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 px-4 py-6">
          <Button
            type="primary"
            onClick={() =>
              router.push(urlJoin(params.team as string, "tasks/new"))
            }
          >
            Create new task
          </Button>
          <NoSsrWarp>
            <Filter
              columns={columns}
              setFilters={(filter) => setFilter(filter)}
            />
          </NoSsrWarp>
          <Button>Sort</Button>
        </div>
        <div className="px-4 py-6">
          <Pagination
            totalPage={20}
            onChange={(page, size) => console.log("onEnter ===>", page, size)}
          />
        </div>
      </div>
      <Table data={data} columns={[...columns, ...actionColumn]} />
    </div>
  )
}
