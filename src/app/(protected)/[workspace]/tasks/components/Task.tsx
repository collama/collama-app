"use client"

import React, { useCallback, useEffect, useState } from "react"
import { type ColumnsType, Table } from "~/ui/Table"
import { Tag } from "~/ui/Tag"
import { IconX } from "@tabler/icons-react"
import type { Task, User } from "@prisma/client"
import { api, useAction } from "~/trpc/client"
import { toFullDate } from "~/ults/datetime"
import { Button } from "~/ui/Button"
import { useRouter } from "next/navigation"
import { NoSsrWarp } from "~/components/NoSsr"
import { Pagination } from "~/ui/Pagination"
import { Filter } from "~/ui/Filter"
import useAsyncEffect from "use-async-effect"
import { upsertFilterAction } from "~/app/(protected)/[workspace]/tasks/components/actions"
import {
  FilterOperator,
  type FilterValue,
  type SortValue,
} from "~/common/types/props"
import { Sort } from "~/ui/Sort"
import Link from "next/link"
import urlJoin from "url-join"

const columns: ColumnsType = [
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
    type: "date",
    render: (isPrivate: boolean) => (
      <Tag color={isPrivate ? "green" : "red"}>{isPrivate.toString()}</Tag>
    ),
  },
]

type ParseSetting = {
  filter: FilterValue
  sort: SortValue
}

type FilterSettingState = { count: number } & ParseSetting

export const DefaultSort: SortValue = {
  list: [],
}
export const DefaultFilter: FilterValue = {
  list: [],
  operator: FilterOperator.And,
}

const DEFAULT_FILTER_SETTING_STATE = {
  filter: DefaultFilter,
  sort: DefaultSort,
  count: 0,
}

export function Task({ workspaceName }: { workspaceName: string }) {
  const router = useRouter()
  const upsertSetting = useAction(upsertFilterAction).mutate

  const [filterSetting, setFilterSetting] = useState<FilterSettingState>(
    DEFAULT_FILTER_SETTING_STATE
  )

  const [data, setData] = useState<Task[]>([])

  const onFilter = useCallback(
    (filter: FilterValue) =>
      setFilterSetting((prevState) => ({
        ...prevState,
        filter,
        count: prevState.count + 1,
      })),
    []
  )

  const onSort = useCallback(
    (sort: SortValue) =>
      setFilterSetting((prevState) => ({
        ...prevState,
        sort,
        count: prevState.count + 1,
      })),
    []
  )

  useAsyncEffect(async () => {
    const filterSetting =
      await api.filterSetting.getFilterSettingByWorkspaceName.query({
        workspaceName,
      })

    if (!filterSetting?.setting) return

    const settingValue = {
      ...DEFAULT_FILTER_SETTING_STATE,
      ...(JSON.parse(filterSetting.setting) as ParseSetting),
    }

    setFilterSetting((prevState) => ({
      ...prevState,
      ...settingValue,
      count: prevState.count + 1,
    }))
  }, [workspaceName])

  useAsyncEffect(async () => {
    const resp = await api.task.getFilter.query({
      filter: filterSetting.filter,
      sort: filterSetting.sort,
      name: workspaceName,
    })
    setData(resp)
  }, [filterSetting.count])

  useEffect(() => {
    const setting = JSON.stringify({
      filter: filterSetting.filter,
      sort: filterSetting.sort,
    })
    upsertSetting({ workspaceName, setting })
  }, [filterSetting.count, upsertSetting, workspaceName])

  const onDelete = (id: string) => {
    console.log(id)
  }

  const nameColumn: ColumnsType = [
    {
      id: "name",
      title: "Task",
      type: "string",
      render: (name: string) => (
        <Link href={urlJoin("/", workspaceName, name)}>{name}</Link>
      ),
    },
  ]

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
    <div className="px-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 py-6">
          <Button type="primary" onClick={() => router.push("tasks/new")}>
            Create new task
          </Button>
          <NoSsrWarp>
            <Filter
              columns={[...nameColumn, ...columns]}
              setFilters={onFilter}
              defaultFilter={filterSetting.filter}
            />
          </NoSsrWarp>
          <NoSsrWarp>
            <Sort
              columns={[...nameColumn, ...columns]}
              setSorts={onSort}
              defaultSort={filterSetting.sort}
            />
          </NoSsrWarp>
        </div>
        <div className="px-4 py-6">
          <Pagination
            totalPage={20}
            onChange={(page, size) => console.log("onEnter ===>", page, size)}
          />
        </div>
      </div>
      <Table
        data={data}
        columns={[...nameColumn, ...columns, ...actionColumn]}
      />
    </div>
  )
}
