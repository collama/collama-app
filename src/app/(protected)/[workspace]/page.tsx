import React, { Suspense } from "react"
import { MemberOnWorkspace } from "~/app/(protected)/[workspace]/components/workspace-member/MemberOnWorkspace"
import { type PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-http"
import Loading from "~/ui/loading"

interface Props {
  workspace: string
}

export default async function WorkspacePage({ params }: PageProps<Props>) {
  const workspace = await api.workspace.getBySlug.query({
    slug: params.workspace,
  })

  if (!workspace) {
    return <h1>Not found</h1>
  }

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <MemberOnWorkspace workspace={workspace} />
      </Suspense>
    </div>
  )
}
