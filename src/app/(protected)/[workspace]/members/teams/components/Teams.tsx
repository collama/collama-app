"use client"

import { type Team, type Workspace } from "@prisma/client"
import { IconX } from "@tabler/icons-react"
import Link from "next/link"
import { useEffect } from "react"
import urlJoin from "url-join"
import useAsyncEffect from "use-async-effect"
import { deleteTeamByIdAction } from "~/app/(protected)/[workspace]/actions"
import { type TeamIncludeOwner } from "~/common/types/prisma"
import { sleep } from "~/common/utils"
import { toFullDate } from "~/common/utils/datetime"
import { useAwaitedFn } from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { useNotification } from "~/ui/Notification"
import { type ColumnType, Table } from "~/ui/Table"

const columns: ColumnType<TeamIncludeOwner>[] = [
  {
    title: "Description",
    id: "description",
    render: (description: TeamIncludeOwner["description"]) => (
      <span>{description}</span>
    ),
  },
  {
    title: "Created by",
    id: "owner",
    render: (owner: TeamIncludeOwner["owner"]) => <span>{owner.email}</span>,
  },
  {
    title: "Created at",
    id: "createdAt",
    render: (date: Date) => <span>{toFullDate(date)}</span>,
  },
]

interface Props {
  workspace: Workspace
}

export const Teams = ({ workspace }: Props) => {
  const { data: teams, loading } = useAwaitedFn(
    () =>
      api.team.getTeamsByWorkspaceSlug.query({
        slug: workspace.slug,
      }),
    []
  )

  const {
    mutate: deleteMember,
    status,
    error,
  } = useAction(deleteTeamByIdAction)
  const [notice, holder] = useNotification()

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

  const nameCol: ColumnType<Team> = {
    title: "Name",
    id: "name",
    render: (name: Team["name"], record) => (
      <Link
        className="hover:text-violet-500"
        href={urlJoin("/", workspace.slug, "members", "teams", record.slug)}
      >
        <div>{name}</div>
      </Link>
    ),
  }

  const actionCol: ColumnType<Team> = {
    title: "Action",
    id: "id",
    render: (teamId: string, data) => (
      <span
        className="table-icon"
        onClick={() => {
          console.log("delete team", teamId, data)
        }}
      >
        <IconX />
      </span>
    ),
  }

  return (
    <>
      <Table
        data={teams}
        columns={[nameCol, ...columns, actionCol]}
        loading={loading}
      />
      {holder}
    </>
  )
}
