import { getAuthSession } from "src/common/next-auth"
import * as E from "fp-ts/Either"
import { redirect } from "next/navigation"
import { api } from "~/trpc/server-invoker"
import Link from "next/link"
import CreateWorkspaceForm from "~/app/component/CreateWorkspaceForm"

export default async function Page() {
  const session = await getAuthSession()
  if (E.isLeft(session)) {
    redirect("/auth")
  }

  const workspaces = await api.workspace.getAll.query()

  return (
    <div>
      <h1>Dashboard</h1>
      <CreateWorkspaceForm />
      <ul>
        {workspaces.map((w) => (
          <li key={w.id}>
            <Link href={`/${w.name}`}>{w.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
