"use client"

import { useEffect } from "react"
import useAsyncEffect from "use-async-effect"
import { deleteMemberOnTeamByIdAction } from "~/app/(protected)/[workspace]/actions"
import { type TeamPageParams } from "~/app/(protected)/[workspace]/teams/[team]/page"
import { RemoveIcon } from "~/app/components/RemoveIcon"
import { type MembersOnTeamsIncludeUser } from "~/common/types/prisma"
import { sleep } from "~/common/utils"
import { toFullDate } from "~/common/utils/datetime"
import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { useNotification } from "~/ui/Notification"
import { type ColumnType, Table } from "~/ui/Table"
import { Tag } from "~/ui/Tag"

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
