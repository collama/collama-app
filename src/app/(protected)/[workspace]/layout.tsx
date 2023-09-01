import { type PropsWithChildren } from "react"
import { type PageProps } from "~/common/types/props"
import Link from "next/link"
import { Logout } from "~/app/(protected)/[workspace]/components/Logout"
import { getAuthSession } from "~/libs/auth"

interface Props {
  workspace: string
  team: string
}

export default async function RootLayout({
  children,
  params,
}: PageProps<Props> & PropsWithChildren) {
  const session = await getAuthSession()

  return (
    <div className="flex h-screen">
      <aside className="flex w-[300px] flex-col border-r bg-gray-50">
        <div>
          <div>
            {session ? (
              <span>{session.user.username}</span>
            ) : (
              <Link href={`/auth/sign-in`}>Login</Link>
            )}
          </div>

          <hr />
          <div>
            <div>
              <Link href={`/${params.workspace}`}>Home</Link>
            </div>
            <div>
              <Link href={`/${params.workspace}/tasks`}>Tasks</Link>
            </div>
            <div>
              <Link href={`/${params.workspace}/settings`}>Settings</Link>
            </div>
            <div>
              <Logout />
            </div>
          </div>
        </div>
      </aside>
      <main className="w-full">
        <div className="">{children}</div>
      </main>
    </div>
  )
}
