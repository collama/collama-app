import { type PropsWithChildren } from "react"
import { type PageProps } from "~/common/types/props"
import Link from "next/link"
import { Logout } from "~/app/(protected)/[workspace]/components/Logout"
import { getAuthSession } from "~/libs/auth"
import { Button } from "~/ui/Button"
import urlJoin from "url-join"
import { Heading } from "~/components/Heading"
import { Breadcrumbs } from "~/components/Breadcrumbs"

interface Props {
  workspace: string
  team: string
}

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Task", path: "/tasks" },
  { name: "Setting", path: "/settings" },
]

export default async function WorkspaceLayout({
  children,
  params,
}: PageProps<Props> & PropsWithChildren) {
  const session = await getAuthSession()

  return (
    <div className="flex h-screen">
      <aside className="flex w-[200px] flex-col border-r">
        <div>
          <Heading />
          <hr />
          <div className="flex flex-col px-2 ">
            {menuItems.map((item) => (
              <div key={item.path}>
                <Button type="text">
                  <Link href={urlJoin(`/${params.workspace}`, item.path)}>
                    {item.name}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <div>
            <div className="mt-10 border-t p-4">
              {session?.user ? (
                <div className="space-y-2.5">
                  <div>
                    Hi <span className="font-medium">{session.user.name}</span>{" "}
                    !
                  </div>
                  <Logout />
                </div>
              ) : (
                  <Button >
                    <Link href="auth/sign-in">Sign In</Link>
                  </Button>
              )}
            </div>
          </div>
        </div>
      </aside>
      <main className="w-full">
        <Breadcrumbs />
        <div className="">{children}</div>
      </main>
    </div>
  )
}
