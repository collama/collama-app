import type { TaskRevision } from "@prisma/client"
import { Suspense } from "react"
import { Templates } from "~/app/(protected)/[workspace]/[task]/components/Templates"
import { Variables } from "~/app/(protected)/[workspace]/[task]/components/Variables"
import type { PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-http"
import Loading from "~/ui/loading"


interface TaskProps {
  task: string
  workspace: string
}
interface TaskSearchProps {
  version: string
}

export interface TaskRevisionProps {
  taskRevision: TaskRevision
}

export default async function TaskPage({
  params,
  searchParams,
}: PageProps<TaskProps, TaskSearchProps>) {
  const taskRevision = await api.taskRevision.getByIdAndVersion.query({
    workspaceSlug: params.workspace,
    taskSlug: params.task,
    version: searchParams.version,
  })

  if (!taskRevision) {
    return <div>Invalid task</div>
  }

  return (
    <Suspense fallback={<Loading />}>
      <Templates taskRevision={taskRevision} />
      <Variables />
    </Suspense>
  )
}
