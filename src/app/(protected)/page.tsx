import { api } from "~/trpc/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const workspace = await api.workspace.getFirst.query()
  if (workspace) {
    redirect(workspace.name)
  }

  return <div>No workspace exist</div>
}
