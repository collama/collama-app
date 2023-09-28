import React from "react"
import { CreateTeamForm } from "~/app/(protected)/[workspace]/components/Team/CreateTeamForm"
import { Teams } from "~/app/(protected)/[workspace]/components/Team/Teams"
import { type PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-http"

interface Props {
  workspace: string
}

export default async function Page({ params }: PageProps<Props>) {
  const workspace = await api.workspace.getBySlug.query({
    slug: params.workspace,
  })

  if (!workspace) {
    return <h1>Not found</h1>
  }

  return (
    <div className="mt-4 space-y-6">
      <div className="rounded-lg border p-6">
        <CreateTeamForm workspace={workspace} />
      </div>
      <div>
        <Teams workspace={workspace} />
      </div>
    </div>
  )
}
