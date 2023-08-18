import { api } from "~/trpc/server-invoker"
import { type PageProps } from "~/common/types/props"
import { InviteForm } from "~/app/(protected)/[workspace]/components/InviteForm"
import { Suspense } from "react"
import Loading from "~/ui/loading"
import { Members } from "~/app/(protected)/[workspace]/components/Members"
import { getSession } from "~/common/passage"
import { Teams } from "~/app/(protected)/[workspace]/components/Team/Teams"
import { CreateTeamForm } from "~/app/(protected)/[workspace]/components/Team/CreateTeamForm"

interface Props {
  workspace: string
}

export default async function WorkspacePage({ params }: PageProps<Props>) {
  const session = await getSession()()
  const workspace = await api.workspace.getByNamePublic.query({
    workspaceName: params.workspace,
  })

  if (!workspace) {
    return <h1>Not found</h1>
  }

  return (
    <div>
      <h1>
        Hello <span className="text-red-500">{workspace.name}</span> workspace
      </h1>

      <hr />
      <div>
        <h2>Workspace members</h2>
        <Suspense fallback={<Loading />}>
          <InviteForm workspaceName={params.workspace} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <Members workspaceName={params.workspace} session={session} />
        </Suspense>
      </div>
      <hr />
      <div>
        <h3>Create Team</h3>
        <Suspense fallback={<Loading />}>
          <CreateTeamForm workspaceName={params.workspace} />
        </Suspense>
        <Teams workspaceName={params.workspace} />
      </div>
    </div>
  )
}
