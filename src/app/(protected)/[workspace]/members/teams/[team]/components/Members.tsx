"use client"

import { type Team } from "@prisma/client"
import { useEffect } from "react"
import useAsyncEffect from "use-async-effect"
import { removeTeamMemberByIdAction } from "~/app/(protected)/[workspace]/actions"
import { RemoveIcon } from "~/app/components/RemoveIcon"
import { type MembersOnTeamsIncludeUser } from "~/common/types/prisma"
import { sleep } from "~/common/utils"
import { toFullDate } from "~/common/utils/datetime"
import { useAwaitedFn } from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { useNotification } from "~/ui/Notification"
import { type ColumnType, Table } from "~/ui/Table"
import { Tag } from "~/ui/Tag"

interface Props {
  workspaceSlug: string
  teamSlug: string
  team: Team
}

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

export const Members = ({ teamSlug, workspaceSlug, team }: Props) => {
  const { data } = useAwaitedFn(
    () => api.team.getMembersByTeamId.query({ id: team.id }),
    []
  )
  const {
    mutate: removeTeamMemberById,
    status,
    error,
  } = useAction(removeTeamMemberByIdAction)
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
    render: (memberId: string) => {
      return (
        <RemoveIcon
          onClick={() =>
            removeTeamMemberById({
              id: team.id,
              memberId,
            })
          }
        />
      )
    },
  }

  return (
    <>
      <Table data={data} columns={[...columns, actionCol]} />
      {holder}
    </>
  )
}
