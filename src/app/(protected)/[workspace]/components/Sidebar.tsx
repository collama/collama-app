import { type Session } from "next-auth"
import Link from "next/link"
import urlJoin from "url-join"
import { Logout } from "~/app/(protected)/[workspace]/components/Logout"
import { type PageProps } from "~/common/types/props"
import { Heading } from "~/components/Heading"
import { getAuthSession } from "~/libs/auth"
import { Button } from "~/ui/Button"

interface Props {
  user?: Session["user"]
  workspaceSlug: string
}

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Members", path: "/members" },
  { name: "Task", path: "/tasks" },
  { name: "Setting", path: "/settings" },
]

export default function Sidebar({ workspaceSlug, user }: Props) {
  return (
    <aside className="flex w-[200px] flex-col border-r">
      <div>
        <Heading />
        <hr />
        <div className="flex flex-col px-2 ">
          {menuItems.map((item) => (
            <div key={item.path}>
              <Button type="text">
                <Link href={urlJoin(`/${workspaceSlug}`, item.path)}>
                  {item.name}
                </Link>
              </Button>
            </div>
          ))}
        </div>
        <div>
          <div className="mt-10 border-t p-4">
            {user ? (
              <div className="space-y-2.5">
                <div>
                  Hi <span className="font-medium">{user.name}</span> !
                </div>
                <Logout />
              </div>
            ) : (
              <Button>
                <Link href="auth/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
