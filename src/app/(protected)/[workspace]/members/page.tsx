import React, { Suspense } from "react"
import { InviteForm } from "~/app/(protected)/[workspace]/members/components/InviteForm"
import { Members } from "~/app/(protected)/[workspace]/members/components/Members"
import { type PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-http"
import Loading from "~/ui/loading"

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
        <InviteForm workspace={workspace} />
      </div>
      <div>
        <Suspense fallback={<Loading />}>
          <Members workspace={workspace} />
        </Suspense>
      </div>
    </div>
  )
}
