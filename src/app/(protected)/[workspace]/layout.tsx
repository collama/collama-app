import { type PropsWithChildren } from "react"
import { type PageProps } from "~/common/types/props"
import { getSession } from "~/common/passage"
import Link from "next/link"
import * as E from "fp-ts/Either"

interface Props {
  workspace: string
  team: string
}

export default async function RootLayout({
  children,
  params,
}: PageProps<Props> & PropsWithChildren) {
  const session = await getSession()()

  return (
    <div className="flex h-screen">
      <aside className="flex w-[300px] flex-col border-r bg-gray-50">
        <div>
          <div>
            {E.isRight(session) ? (
              <span>Linh Tran</span>
            ) : (
              <Link href={`/auth`}>Login</Link>
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
          </div>
        </div>
      </aside>
      <main className="w-full">
        <div className="">{children}</div>
      </main>
    </div>
  )
}
