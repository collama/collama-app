import { redirect } from "next/navigation"
import { api } from "~/trpc/server-invoker"
import Link from "next/link"
import CreateWorkspaceForm from "~/app/component/CreateWorkspaceForm"
import { getAuthSession } from "~/libs/auth"
import { Logout } from "~/app/component/Logout"

export default async function Page() {
  const session = await getAuthSession()
  if (!session) {
    redirect("/auth/sign-in")
  }

  const workspaces = await api.workspace.getAll.query()

  return (
    <div>
      <h1>Dashboard</h1>
      <Logout />
      <hr />

      <CreateWorkspaceForm />
      <ul>
        {workspaces.map((w) => (
          <li key={w.id}>
            <Link href={`/${w.slug}`}>{w.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
