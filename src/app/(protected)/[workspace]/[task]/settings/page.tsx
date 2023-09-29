import { Suspense } from "react"
import InviteTeamForm from "~/app/(protected)/[workspace]/[task]/settings/components/InviteTeamForm"
import { type PageProps } from "~/common/types/props"
import Loading from "~/ui/loading"

interface Props {
  workspace: string
  team: string
}

export default function SettingsPage({ params }: PageProps<Props>) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <InviteTeamForm teamName={params.team} />
      </Suspense>
    </div>
  )
}
