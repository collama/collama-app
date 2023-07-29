import { getSession } from "~/common/passage"
import * as E from "fp-ts/Either"
import { redirect } from "next/navigation"
import { api } from "~/trpc/server-invoker"
import Link from "next/link"
import CreateWorkspaceForm from "~/app/component/CreateWorkspaceForm"

export default async function Page() {
  const session = await getSession()()
  if (E.isLeft(session)) {
    redirect("/auth")
  }

  const workspaces = await api.workspace.getAll.query()

  if (workspaces.length === 0) {
    return (
      <div>
        <h1>Dashboard</h1>
        <section>
          <CreateWorkspaceForm />
        </section>
      </div>
    )
  }

  return (
    <div>
      <h1>Dashboard</h1>
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
