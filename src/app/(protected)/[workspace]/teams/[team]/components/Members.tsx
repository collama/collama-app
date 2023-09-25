"use client"

import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { type TeamPageParams } from "~/app/(protected)/[workspace]/teams/[team]/page"
import { type ColumnType, Table } from "~/ui/Table"
import { type MembersOnTeamsIncludeUser } from "~/common/types/prisma"
import { Tag } from "~/ui/Tag"
import { toFullDate } from "~/common/utils/datetime"
import { RemoveIcon } from "~/app/component/RemoveIcon"
import { deleteMemberOnTeamByIdAction } from "~/app/(protected)/[workspace]/actions"
import { useEffect } from "react"
import { useNotification } from "~/ui/Notification"
import useAsyncEffect from "use-async-effect"
import { sleep } from "~/common/utils"

const columns: ColumnType<MembersOnTeamsIncludeUser>[] = [
  {
    title: "Email",
    id: "user",
    render: (user: MembersOnTeamsIncludeUser["user"]) => (
      <span>{user.email}</span>
    ),
  },
  {
    title: "Role",
    id: "role",
    render: (role: MembersOnTeamsIncludeUser["role"]) => <Tag>{role}</Tag>,
  },
  {
    title: "Create at",
    id: "createdAt",
    render: (date: MembersOnTeamsIncludeUser["createdAt"]) => (
      <span>{toFullDate(date)}</span>
    ),
  },
]

export const Members = ({ teamSlug, workspaceSlug }: TeamPageParams) => {
  const { data } = useAwaited(
    api.team.membersOnTeam.query({ teamSlug, workspaceSlug })
  )
  const {
    mutate: deleteMember,
    status,
    error,
  } = useAction(deleteMemberOnTeamByIdAction)
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
  }, [status, error])

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

  const actionCol: ColumnType<MembersOnTeamsIncludeUser> = {
    title: "Action",
    id: "id",
    render: (id: string) => {
      return <RemoveIcon onClick={() => deleteMember({ id })} />
    },
  }

  return (
    <>
      <Table data={data} columns={[...columns, actionCol]} />
      {holder}
    </>
  )
}
