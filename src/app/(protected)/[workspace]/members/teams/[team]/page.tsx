import { InviteTeamForm } from "./components/InviteTeamForm"
import { Members } from "./components/Members"
import type { PageProps } from "~/common/types/props"
import { TeamNotFound } from "~/server/errors/team.error"
import { api } from "~/trpc/server-http"

interface Props {
  team: string
  workspace: string
}

export default async function TeamPage({ params }: PageProps<Props>) {
  console.log("params", params)
  const team = await api.team.getTeamBySlug.query({
    slug: params.team,
    workspaceSlug: params.workspace,
  })

  if (!team) {
    throw new TeamNotFound()
  }

  return (
    <div className="mt-4 space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold">{team?.name ?? "Team name"}</h2>
      </div>
      <div className="rounded-lg border p-6">
        <InviteTeamForm
          team={team}
          teamSlug={params.team}
          workspaceSlug={params.workspace}
        />
      </div>
      <Members
        team={team}
        teamSlug={params.team}
        workspaceSlug={params.workspace}
      />
    </div>
  )
}
