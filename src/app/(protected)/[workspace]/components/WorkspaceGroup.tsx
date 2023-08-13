import Link from "next/link"
import { api } from "~/trpc/server-invoker"

interface Props {}

export default async function WorkspaceGroup({}: Props) {
  const workspaces = await api.workspace.getAll.query()
  console.log(workspaces)

  return (
    <div className="w-full p-2 py-2">
      <div className="p-2">
        <div className="text-xs font-medium">Workspaces</div>
        <ul>
          {workspaces.map((w) => (
            <li key={w.id}>
              <Link href={`/${w.name}`}>{w.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
