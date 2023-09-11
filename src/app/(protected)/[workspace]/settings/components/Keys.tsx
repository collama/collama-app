"use client"
import { type ColumnType, Table } from "~/ui/Table"
import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { RemoveIcon } from "~/app/component/RemoveIcon"
import { type ApiKeyIncludeUser } from "~/common/types/prisma"
import { toFullDate } from "~/common/utils/datetime"
import { Tag } from "~/ui/Tag"
import { deleteApiKeyAction } from "~/app/(protected)/[workspace]/settings/keys/new/actions"
import { useNotification } from "~/ui/Notification"
import { useEffect } from "react"
import useAsyncEffect from "use-async-effect"
import { sleep } from "~/common/utils"

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
