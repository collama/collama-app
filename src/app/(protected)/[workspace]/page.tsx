import { api } from "~/trpc/server-invoker"
import { type PageProps } from "~/common/types/props"
import React, { Suspense } from "react"
import Loading from "~/ui/loading"
import { MemberOnWorkspace } from "~/app/(protected)/[workspace]/components/workspace-member/MemberOnWorkspace"

interface Props {
  workspace: string
}

export default async function WorkspacePage({ params }: PageProps<Props>) {
  const workspace = await api.workspace.getBySlugPublic.query({
    workspaceSlug: params.workspace,
  })

  if (!workspace) {
    return <h1>Not found</h1>
  }

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <MemberOnWorkspace workspaceSlug={workspace.name} />
      </Suspense>
    </div>
  )
}
