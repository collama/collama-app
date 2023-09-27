"use client"

import { useEffect } from "react"
import useAsyncEffect from "use-async-effect"
import { deleteApiKeyAction } from "~/app/(protected)/[workspace]/settings/keys/new/actions"
import { RemoveIcon } from "~/app/components/RemoveIcon"
import { type ApiKeyIncludeUser } from "~/common/types/prisma"
import { sleep } from "~/common/utils"
import { toFullDate } from "~/common/utils/datetime"
import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { useNotification } from "~/ui/Notification"
import { type ColumnType, Table } from "~/ui/Table"
import { Tag } from "~/ui/Tag"

const columns: ColumnType<ApiKeyIncludeUser>[] = [
  {
    id: "title",
    title: "Title",
    render: (title: string) => <span>{title}</span>,
  },
  {
    id: "hint",
    title: "Hint",
    render: (hint: string) => <span>{hint}</span>,
  },
  {
    id: "owner",
    title: "Insert by",
    render: (owner: ApiKeyIncludeUser["owner"]) => <span>{owner.email}</span>,
  },
  {
    id: "createdAt",
    title: "Created At",
    render: (date: ApiKeyIncludeUser["createdAt"]) => (
      <span>{toFullDate(date)}</span>
    ),
  },
  {
    id: "provider",
    title: "Provider",
    render: (provider: ApiKeyIncludeUser["provider"]) => <Tag>{provider}</Tag>,
  },
]

export function Keys() {
  const { data, loading } = useAwaited(api.apiKey.getAll.query())
  const { mutate: deleteKey, status, error } = useAction(deleteApiKeyAction)
  const [notice, holder] = useNotification()

  useEffect(() => {
    if (status === "error" && error) {
      notice.open({
        content: {
          message: "Failed to delete api key",
          description: error.message,
        },
        status: "error",
      })
    }
  }, [error, status])

  useAsyncEffect(async () => {
    if (status === "success") {
      notice.open({
        content: {
          message: "Delete api key is successfully",
        },
        status: "success",
      })

      await sleep(500)
      window.location.reload()
    }
  }, [status])

  const actionCol: ColumnType<ApiKeyIncludeUser> = {
    id: "id",
    title: "Action",
    render: (id: string) => <RemoveIcon onClick={() => deleteKey({ id })} />,
  }

  return (
    <>
      <Table data={data} columns={[...columns, actionCol]} loading={loading} />
      {holder}
    </>
  )
}
