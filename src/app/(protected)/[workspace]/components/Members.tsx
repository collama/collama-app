"use client"

import { type Workspace } from "@prisma/client"
import { IconX } from "@tabler/icons-react"
import { useEffect } from "react"
import useAsyncEffect from "use-async-effect"
import { removeMemberOnWorkspaceAction } from "~/app/actions"
import { type MemberOnWorkspaceIncludeUserMail } from "~/common/types/prisma"
import { sleep } from "~/common/utils"
import { toFullDate } from "~/common/utils/datetime"
import { useAwaitedFn } from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { useNotification } from "~/ui/Notification"
import { type ColumnType, Table } from "~/ui/Table"
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
  workspace: Workspace
}

export const Members = ({ workspace }: Props) => {
  const { data: members, loading } = useAwaitedFn(
    () =>
      api.workspace.getMembersOnWorkspace.query({
        id: workspace.id,
      }),
    []
  )

  const {
    mutate: deleteMember,
    status,
    error,
  } = useAction(removeMemberOnWorkspaceAction)
  const [notice, holder] = useNotification()

  const actionCol: ColumnType<MemberOnWorkspaceIncludeUserMail>[] = [
    {
      title: "Action",
      id: "id",
      render: (memberId: string) => (
        <span
          className="table-icon"
          onClick={() => deleteMember({ id: workspace.id, memberId })}
        >
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
