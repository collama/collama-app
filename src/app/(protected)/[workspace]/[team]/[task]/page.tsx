import type { PageProps } from "~/common/types/props"
import { api } from "~/trpc/server"

interface TaskProps {
  task: string
}

export default async function TaskPage({ params }: PageProps<TaskProps>) {
  const task = await api.task.getByName.query({
    name: params.task,
  })

  if (!task) {
    return <div>Invalid task</div>
  }

  return (
    <div>
      <h3>Task: {params.task}</h3>
      <div>
        <h4>Prompt</h4>
        <div>
          <input
            className="border-1 border-amber-300"
            type="text"
            defaultValue={task.name}
          />
        </div>
        <div>
          <textarea
            defaultValue={task.prompt ?? ""}
            className="border-1 border-amber-300"
          ></textarea>
        </div>
      </div>
    </div>
  )
}
