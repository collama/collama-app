import { api } from "~/trpc/server-invoker"
import Link from "next/link"

export default async function Page() {
  const workspaces = await api.workspace.getAll.query()

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {workspaces.map((w) => (
          <Link href={`/${w.name}`} key={w.id}>
            {w.name}
          </Link>
        ))}
      </ul>
    </div>
  )
}
