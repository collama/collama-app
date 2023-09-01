import type { PageProps } from "~/common/types/props"
import { InviteTeamForm } from "./components/InviteTeamForm"
import { Members } from "./components/Members"

interface Props {
  team: string
  workspace: string
}

export type TeamByNamePageParams = {
  teamId: string
  workspaceName: string
}

export default function TeamPage({ params }: PageProps<Props>) {
  return (
    <div>
      <div>Hello {params.team}</div>
      <InviteTeamForm teamId={params.team} workspaceName={params.workspace} />
      <Members teamId={params.team} workspaceName={params.workspace} />
    </div>
  )
}
