import { IconSettings2, IconSmartHome, IconUsers } from "@tabler/icons-react"
import { type PropsWithChildren } from "react"
import NavItem from "~/app/(protected)/[workspace]/components/NavItem"
import { type PageProps } from "~/common/types/props"
import { getSession } from "~/common/passage"
import * as E from "fp-ts/Either"
import TeamGroup from "~/app/(protected)/[workspace]/components/TeamGroup"
import Login from "~/app/(protected)/[workspace]/components/Login"
import TaskGroup from "~/app/(protected)/[workspace]/components/TaskGroup"
import WorkspaceGroup from "~/app/(protected)/[workspace]/components/WorkspaceGroup"

interface Props {
  workspace: string
}

export default async function RootLayout({
  children,
  params,
}: PageProps<Props> & PropsWithChildren) {
  const session = await getSession()()

  return (
    <div className="flex h-screen">
      <aside className="flex w-[300px] flex-col border-r bg-gray-50">
        {E.isRight(session) && <WorkspaceGroup />}
        <div className="border-b py-2">
          <NavItem
            icon={<IconSmartHome size={18} color="#4b5563" />}
            title="Home"
            href={`/${params.workspace}`}
          />
          {E.isRight(session) && (
            <NavItem
              icon={<IconUsers size={18} color="#4b5563" />}
              title="Members"
              href={`/${params.workspace}/members`}
            />
          )}
          {E.isRight(session) && (
            <NavItem
              icon={<IconSettings2 size={18} color="#4b5563" />}
              title="Settings"
              href={`/${params.workspace}/settings`}
            />
          )}
        </div>
        {E.isRight(session) && <TaskGroup />}
        {E.isRight(session) && <TeamGroup workspace={params.workspace} />}
        {E.isLeft(session) && <Login />}
      </aside>
      <main className="w-full">
        <div className="">{children}</div>
      </main>
    </div>
  )
}
