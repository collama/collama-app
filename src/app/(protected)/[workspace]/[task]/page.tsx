import type { PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-invoker"
import { TaskOverview } from "~/app/(protected)/[workspace]/[task]/components/TaskOverview"
import { Suspense } from "react"
import Loading from "~/ui/loading"
import { InviteMemberToTask } from "~/app/(protected)/[workspace]/[task]/components/InviteMemberToTask"

interface TaskProps {
  task: string
  workspace: string
}

export default async function TaskPage({ params }: PageProps<TaskProps>) {
  const task = await api.task.getByName.query({
    name: params.task,
  })

  if (!task) {
    return <div>Invalid task</div>
  }

  return (
    <div className='flex justify-between'>
      <Suspense fallback={<Loading />}>
        <TaskOverview task={task} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <InviteMemberToTask workspaceName={params.workspace} taskName={params.task}/>
      </Suspense>
    </div>
  )
}
