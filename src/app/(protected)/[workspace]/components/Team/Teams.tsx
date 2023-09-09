"use client"

import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import Link from "next/link"
import { type ColumnType, Table } from "~/ui/Table"
import { type Team } from "@prisma/client"
import { toFullDate } from "~/common/utils/datetime"
import { IconX } from "@tabler/icons-react"
import { type TeamIncludeOwner } from "~/common/types/prisma"
import { deleteMemberOnTeamAction } from "~/app/(protected)/[workspace]/actions"
import { useEffect } from "react"
import { useNotification } from "~/ui/Notification"
import useAsyncEffect from "use-async-effect"
import { sleep } from "~/common/utils"

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
  workspaceName: string
}

export const Teams = (props: Props) => {
  const { data: teams, loading } = useAwaited(
    api.team.teamsOnWorkspace.query({
      workspaceName: props.workspaceName,
    })
  )

  const {
    mutate: deleteMember,
    status,
    error,
  } = useAction(deleteMemberOnTeamAction)
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
        content: { message: "Failed to delete member" },
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
        href={`/${props.workspaceName}/teams/${record.slug}`}
      >
        <div>{name}</div>
      </Link>
    ),
  }

  const actionCol: ColumnType<Team> = {
    title: "Action",
    id: "id",
    render: (id: string) => (
      <span className="table-icon" onClick={() => deleteMember({ id })}>
        <IconX />
      </span>
    ),
  }

  return (
    <>
      <Table data={teams} columns={[nameCol, ...columns, actionCol]} loading={loading}/>
      {holder}
    </>
  )
}
