"use client"

import type { User } from "@prisma/client"
import { type UseTRPCActionResult } from "@trpc/next/src/app-dir/create-action-hook"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import urlJoin from "url-join"
import useAsyncEffect from "use-async-effect"
import {
  deleteTaskByIdAction,
  upsertFilterAction,
} from "~/app/(protected)/[workspace]/tasks/actions"
import { RemoveIcon } from "~/app/components/RemoveIcon"
import { type TaskIncludeOwner } from "~/common/types/prisma"
import {
  FilterOperator,
  type FilterValue,
  type SortValue,
} from "~/common/types/props"
import { toFullDate } from "~/common/utils/datetime"
import { NoSsrWarp } from "~/components/NoSsr"
import { useAwaitedFn } from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { Button } from "~/ui/Button"
import { Filter } from "~/ui/Filter"
import { useNotification } from "~/ui/Notification"
import { type PageSize, Pagination } from "~/ui/Pagination"
import { Sort } from "~/ui/Sort"
import { type ColumnType, Table } from "~/ui/Table"
import { Tag } from "~/ui/Tag"

const columns: ColumnType<TaskIncludeOwner>[] = [
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

const DEFAULT_PAGES: { page: number; limit: PageSize } = {
  page: 1,
  limit: 10,
}

const checkLoadings = (
  ...loadings: UseTRPCActionResult<never>["status"][]
): boolean => loadings.some((loading) => loading === "loading")

export function Tasks({ workspaceSlug }: { workspaceSlug: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    mutate: upsertSetting,
    status: upsertSettingStatus,
    error: upsertSettingError,
  } = useAction(upsertFilterAction)
  const {
    mutate: deleteTask,
    status: deleteTaskStatus,
    error: deleteTaskError,
  } = useAction(deleteTaskByIdAction)
  const [notice, holder] = useNotification()

  const [filterSetting, setFilterSetting] = useState<FilterSettingState>(
    DEFAULT_FILTER_SETTING_STATE
  )
  const [pages, setPages] = useState(DEFAULT_PAGES)

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
      await api.filterSetting.getFilterSettingByWorkspaceSlug.query({
        workspaceSlug,
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
  }, [workspaceSlug])

  const { data, refresh } = useAwaitedFn(
    async () =>
      api.task.filterAndSort.query({
        filter: filterSetting.filter,
        sort: filterSetting.sort,
        workspaceSlug: workspaceSlug,
        page: pages.page,
        limit: pages.limit,
      }),
    [filterSetting.count, pages.page, pages.limit, pathname]
  )

  useEffect(() => {
    const setting = JSON.stringify({
      filter: filterSetting.filter,
      sort: filterSetting.sort,
    })

    upsertSetting({ workspaceSlug, setting })
  }, [filterSetting.count, workspaceSlug])

  const nameColumn: ColumnType<TaskIncludeOwner>[] = [
    {
      id: "name",
      title: "Task",
      type: "string",
      render: (name: string, record) => {
        return (
          <Link
            href={urlJoin(
              "/",
              workspaceSlug,
              `${record.slug}?&version=${
                record?.taskRevision?.[0]?.version ?? ""
              }`
            )}
          >
            {name}
          </Link>
        )
      },
    },
  ]

  const actionColumn: ColumnType<TaskIncludeOwner>[] = [
    {
      title: "Action",
      id: "id",
      render: (id: string) => <RemoveIcon onClick={() => deleteTask({ id })} />,
    },
  ]

  useEffect(() => {
    if (deleteTaskStatus === "error" && deleteTaskError) {
      notice.open({
        content: {
          message: "Failed to delete task",
          description: deleteTaskError.message,
        },
        status: "error",
      })
    }
  }, [deleteTaskError, deleteTaskStatus])

  useAsyncEffect(() => {
    if (deleteTaskStatus === "success") {
      notice.open({
        content: {
          message: "Delete task is successfully",
        },
        status: "success",
      })

      refresh()
      // await sleep(500)
      // window.location.reload()
    }
  }, [deleteTaskStatus])

  useEffect(() => {
    if (upsertSettingStatus === "error" && upsertSettingError) {
      notice.open({
        content: {
          message: "Failed to filter table",
        },
        status: "error",
      })
    }
  }, [upsertSettingError, upsertSettingStatus])

  const loading = checkLoadings(upsertSettingStatus, deleteTaskStatus)

  return (
    <div className="px-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 py-6">
          <Button type="primary" onClick={() => router.push("tasks/new")}>
            Create new task
          </Button>
          <Button type="primary" onClick={() => refresh()}>
            Refresh
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
            total={data?.[1]?.totalCount ?? 1}
            pageSize={DEFAULT_PAGES.limit}
            onChange={(page, size) => setPages({ page, limit: size })}
          />
        </div>
      </div>
      <Table
        data={data?.[0]}
        columns={[...nameColumn, ...columns, ...actionColumn]}
        loading={loading}
      />
      {holder}
    </div>
  )
}
