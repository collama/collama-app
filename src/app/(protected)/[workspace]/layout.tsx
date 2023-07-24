import Link from "next/link"
import {
  IconBox,
  IconChevronsUp,
  IconInbox,
  IconSettings2,
  IconSmartHome,
  IconUsers,
} from "@tabler/icons-react"
import Loading from "~/ui/loading"
import { type PropsWithChildren, Suspense } from "react"
import { NavHeader } from "~/app/(protected)/[workspace]/components/NavHeader"
import NavItem from "~/app/(protected)/[workspace]/components/NavItem"
import Teams from "~/app/(protected)/[workspace]/components/Teams"
import { type PageProps } from "~/common/types/props"
import { api } from "~/trpc/server"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Pulsa",
  description: "Make AI is easier",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

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
      <aside className="flex flex-col w-[300px] bg-gray-50 border-r">
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
