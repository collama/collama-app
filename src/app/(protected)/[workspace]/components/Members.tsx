"use client"

import { api, useAction } from "~/trpc/client"
import useAwaited from "~/hooks/useAwaited"
import Loading from "~/ui/loading"
import { type ColumnType, Table } from "~/ui/Table"
import { type MemberOnWorkspaceIncludeUserMail } from "~/common/types/prisma"
import { toFullDate } from "~/common/utils/datetime"
import { IconX } from "@tabler/icons-react"
import { deleteMemberOnWorkspaceAction } from "~/app/actions"
import { useNotification } from "~/ui/Notification"
import useAsyncEffect from "use-async-effect"
import { sleep } from "~/common/utils"
import { useEffect } from "react"
import { Tag } from "~/ui/Tag"

const columns: ColumnType<MemberOnWorkspaceIncludeUserMail>[] = [
  {
    title: "Name",
    id: "user",
    render: (user: MemberOnWorkspaceIncludeUserMail["user"]) => (
      <span>{user.email}</span>
    ),
  },
  {
    title: "Role",
    id: "role",
    render: (role) => <Tag>{role}</Tag>,
  },
  {
    title: "Invite at",
    id: "createdAt",
    render: (date: Date) => <span>{toFullDate(date)}</span>,
  },
]

interface Props {
  workspaceName: string
}

export const Members = (props: Props) => {
  const { data: members, loading } = useAwaited(
    api.workspace.getMembersFromWorkspace.query({
      name: props.workspaceName,
    })
  )

  const {
    mutate: deleteMember,
    status,
    error,
  } = useAction(deleteMemberOnWorkspaceAction)
  const [notice, holder] = useNotification()

  const actionCol: ColumnType<MemberOnWorkspaceIncludeUserMail>[] = [
    {
      title: "Action",
      id: "id",
      render: (id: string) => (
        <span className="table-icon" onClick={() => deleteMember({ id })}>
          <IconX />
        </span>
      ),
    },
  ]

  useAsyncEffect(async () => {
    if (status === "success") {
      notice.open({
        content: { message: "Deleted member is successfully!" },

        status: "success",
      })
      await sleep(500)
      window.location.reload()
    }
  }, [status])

  useEffect(() => {
    if (status === "error" && error) {
      notice.open({
        content: {
          message: "Failed to delete member",
          description: error.message,
        },
        status: "error",
      })
    }
  }, [status, error])

  if (loading) {
    return <Loading />
  }

  if (!members) {
    return <div>Empty</div>
  }

  return (
    <>
      <Table data={members} columns={[...columns, ...actionCol]} />
      {holder}
    </>
  )
}
