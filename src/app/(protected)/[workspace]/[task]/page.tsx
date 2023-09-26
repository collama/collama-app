import type { PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-invoker"
import { Suspense } from "react"
import Loading from "~/ui/loading"
import { ClientTask } from "~/app/(protected)/[workspace]/[task]/components/ClientTask"

interface TaskProps {
  task: string
  workspace: string
}

export default async function TaskPage({ params }: PageProps<TaskProps>) {
  const task = await api.task.getBySlug.query({
    slug: params.task,
    workspaceSlug: params.workspace,
  })

  if (!task) {
    return <div>Invalid task</div>
  }

  return (
    <Suspense fallback={<Loading />}>
      <ClientTask task={task} />
    </Suspense>
  )
}
