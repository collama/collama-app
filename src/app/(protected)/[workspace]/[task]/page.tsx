import type { PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-invoker"
import { TaskOverview } from "~/app/(protected)/[workspace]/[task]/components/TaskOverview"
import { Suspense } from "react"
import Loading from "~/ui/loading"

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
    <Suspense fallback={<Loading />}>
      <TaskOverview task={task} />
    </Suspense>
  )
}
