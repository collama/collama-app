import {
  InviteMemberToTask,
  type InviteMemberToTaskProps,
} from "~/app/(protected)/[workspace]/[task]/components/InviteMemberToTask"
import React, { useEffect } from "react"
import { type ColumnType, Table } from "~/ui/Table"
import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import type { MembersOnTaskIncludeUser } from "~/common/types/prisma"
import { Tag } from "~/ui/Tag"
import { toFullDate } from "~/common/utils/datetime"
import { RemoveIcon } from "~/app/component/RemoveIcon"
import { useNotification } from "~/ui/Notification"
import { deleteMemberOnTaskAction } from "~/app/(protected)/[workspace]/tasks/new/actionts"
import useAsyncEffect from "use-async-effect"
import { sleep } from "~/common/utils"

const columns: ColumnType<MembersOnTaskIncludeUser>[] = [
  {
    title: "Email",
    id: "user",
    render: (user: MembersOnTaskIncludeUser["user"]) => (
      <span>{user?.email}</span>
    ),
  },
  {
    title: "Role",
    id: "role",
    render: (role: MembersOnTaskIncludeUser["role"]) => <Tag>{role}</Tag>,
  },
  {
    title: "Invite at",
    id: "createdAt",
    render: (date: MembersOnTaskIncludeUser["createdAt"]) => (
      <span>{toFullDate(date)}</span>
    ),
  },
]

export function TaskMember({
  taskName,
  workspaceName,
}: InviteMemberToTaskProps) {
  const { data, loading } = useAwaited(
    api.task.getMemberOnTask.query({
      taskSlug: taskName,
      workspaceSlug: workspaceName,
    })
  )

  const {
    mutate: deleteMember,
    status,
    error,
  } = useAction(deleteMemberOnTaskAction)
  const [notice, holder] = useNotification()

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
  }, [error, status])

  useAsyncEffect(async () => {
    if (status === "success") {
      notice.open({
        content: {
          message: "Delete member is successfully",
        },
        status: "success",
      })

      await sleep(500)
      window.location.reload()
    }
  }, [status])

  const actionCol: ColumnType<MembersOnTaskIncludeUser> = {
    title: "Action",
    id: "id",
    render: (id: string) => <RemoveIcon onClick={() => deleteMember({ id })} />,
  }

  return (
    <>
      <div className="space-y-6">
        <InviteMemberToTask workspaceName={workspaceName} taskName={taskName} />
        <Table
          data={data}
          columns={[...columns, actionCol]}
          loading={loading}
        />
      </div>
      {holder}
    </>
  )
}
