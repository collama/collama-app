import {
  InviteMemberToTask,
  type InviteMemberToTaskProps,
} from "~/app/(protected)/[workspace]/[task]/components/InviteMemberToTask"
import React, { useEffect } from "react"
import { type ColumnType, Table } from "~/ui/Table"
import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import type { MembersOnTaskIncludeUserTeam } from "~/common/types/prisma"
import { Tag } from "~/ui/Tag"
import { toFullDate } from "~/common/utils/datetime"
import { RemoveIcon } from "~/app/components/RemoveIcon"
import { useNotification } from "~/ui/Notification"
import useAsyncEffect from "use-async-effect"
import { sleep } from "~/common/utils"
import { removeMemberOnTaskAction } from "~/actions/task.action"

const columns: ColumnType<MembersOnTaskIncludeUserTeam>[] = [
  {
    title: "Email or Team",
    id: "user",
    render: (user: MembersOnTaskIncludeUserTeam["user"], record) => {
      const team = record.team
      if (team) return <span>{team.name}</span>
      return <span>{user?.email}</span>
    },
  },
  {
    title: "Role",
    id: "role",
    render: (role: MembersOnTaskIncludeUserTeam["role"]) => <Tag>{role}</Tag>,
  },
  {
    title: "Invite at",
    id: "createdAt",
    render: (date: MembersOnTaskIncludeUserTeam["createdAt"]) => (
      <span>{toFullDate(date)}</span>
    ),
  },
]

export function TaskMember({ task }: InviteMemberToTaskProps) {
  const { data, loading } = useAwaited(
    api.task.getMembers.query({ id: task.id })
  )

  const {
    mutate: removeMember,
    status,
    error,
  } = useAction(removeMemberOnTaskAction)
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

  const actionColumn: ColumnType<MembersOnTaskIncludeUserTeam> = {
    title: "Action",
    id: "id",
    render: (memberId: string) => (
      <RemoveIcon onClick={() => removeMember({ id: task.id, memberId })} />
    ),
  }

  return (
    <>
      <div className="space-y-6">
        <InviteMemberToTask task={task} />
        <Table
          data={data}
          columns={[...columns, actionColumn]}
          loading={loading}
        />
      </div>
      {holder}
    </>
  )
}
