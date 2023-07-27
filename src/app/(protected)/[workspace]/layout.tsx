import Link from "next/link"
import {
  IconBox,
  IconInbox,
  IconSettings2,
  IconSmartHome,
  IconUsers,
} from "@tabler/icons-react"
import { type PropsWithChildren, Suspense } from "react"
import NavItem from "~/app/(protected)/[workspace]/components/NavItem"
import { type PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-invoker"
import Loading from "~/ui/loading"
import Teams from "~/app/(protected)/[workspace]/components/Teams"
import { redirect } from "next/navigation"

interface Props {
  workspace: string
}

export default async function RootLayout({
  children,
  params,
}: PageProps<Props> & PropsWithChildren) {
  const workspace = await api.workspace.getByName.query({
    workspaceName: params.workspace,
  })

  if (!workspace) {
    redirect("/empty")
  }

  return (
    <div className="flex h-screen">
      <aside className="flex w-[300px] flex-col border-r bg-gray-50">
        {/*<NavHeader />*/}
        <div className="border-b py-2">
          <NavItem
            icon={<IconSmartHome size={18} color="#4b5563" />}
            title="Home"
            href={`/${params.workspace}`}
          />
          <NavItem
            icon={<IconInbox size={18} color="#4b5563" />}
            title="Inbox"
            href={`/${params.workspace}/inbox`}
          />
          <NavItem
            icon={<IconBox size={18} color="#4b5563" />}
            title="Sandbox"
            href={`/${params.workspace}/sandbox`}
          />
          <NavItem
            icon={<IconUsers size={18} color="#4b5563" />}
            title="Members"
            href={`/${params.workspace}/members`}
          />
          <NavItem
            icon={<IconSettings2 size={18} color="#4b5563" />}
            title="Settings"
            href={`/${params.workspace}/settings`}
          />
        </div>
        <div className="py-2">
          <div className="p-2">
            <span className="text-xs font-medium">Teams</span>
            <div>
              <Link
                className="underline"
                href={`/${params.workspace}/teams/new`}
              >
                New Team
              </Link>
            </div>
            <Suspense fallback={<Loading />}>
              <Teams workspace={params.workspace} />
            </Suspense>
          </div>
        </div>
      </aside>
      <main className="w-full">
        <div className="">{children}</div>
      </main>
    </div>
  )
}
