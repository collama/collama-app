import React, { type PropsWithChildren } from "react"
import { Breadcrumb } from "~/app/(protected)/[workspace]/components/Breadcrumb"
import Sidebar from "~/app/(protected)/[workspace]/components/Sidebar"
import { type PageProps } from "~/common/types/props"
import { getAuthSession } from "~/libs/auth"

interface Props {
  workspace: string
  team: string
}

export default async function Layout({
  params,
  children,
}: PageProps<Props> & PropsWithChildren) {
  const session = await getAuthSession()

  return (
    <div className="flex h-screen">
      <Sidebar user={session?.user} workspaceSlug={params.workspace} />
      <main className="w-full">
        <Breadcrumb />
        <div className="">{children}</div>
      </main>
    </div>
  )
}
