import { redirect } from "next/navigation"
import { api } from "~/trpc/server-invoker"
import Link from "next/link"
import CreateWorkspaceForm from "~/app/component/CreateWorkspaceForm"
import { getAuthSession } from "~/libs/auth"
import { Logout } from "~/app/component/Logout"
import { Heading } from "~/components/Heading"

export default async function Page() {
  const session = await getAuthSession()
  if (!session) {
    redirect("/auth/sign-in")
  }

  const workspaces = await api.workspace.getAll.query()

  return (
    <div>
      <Heading />
      <hr />
      <div className="mt-2 ml-2">
        <Logout />
      </div>
      <div className="mx-auto mt-4 w-[450px] space-y-4">
        <CreateWorkspaceForm />
        <div className="rounded-lg border p-4 shadow">
          <h4 className="mb-6 text-neutral-500">Available workspace:</h4>
          <ul>
            {workspaces.map((w) => (
              <li
                key={w.id}
                className="mb-2 cursor-pointer rounded px-2 py-1 shadow hover:bg-violet-400 hover:text-white "
              >
                <Link href={`/${w.slug}`}>{w.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
