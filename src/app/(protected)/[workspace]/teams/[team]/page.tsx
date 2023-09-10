import type { PageProps } from "~/common/types/props"
import { InviteTeamForm } from "./components/InviteTeamForm"
import { Members } from "./components/Members"
import { api } from "~/trpc/server-invoker"

interface Props {
  team: string
  workspace: string
}

export type TeamPageParams = {
  teamSlug: string
  workspaceSlug: string
}

export default async function TeamPage({ params }: PageProps<Props>) {
  const team = await api.team.getTeamBySlug.query({
    teamSlug: params.team,
    workspaceSlug: params.workspace,
  })

  return (
    <div className="mt-4 space-y-6 p-6">
      <div>
        <h2 className='text-xl font-bold'>{team?.name ?? "Team name"}</h2>
      </div>
      <div className="rounded-lg border p-6">
        <InviteTeamForm
          teamSlug={params.team}
          workspaceSlug={params.workspace}
        />
      </div>
      <Members teamSlug={params.team} workspaceSlug={params.workspace} />
    </div>
  )
}
