import { api } from "~/trpc/server-invoker"
import Link from "next/link"

interface Props {
  workspaceName: string
}

export default async function Tasks({ workspaceName }: Props) {
  const tasks = await api.task.getAll.query({})

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <Link href={`/${workspaceName}/${task.name}`}>{task.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
