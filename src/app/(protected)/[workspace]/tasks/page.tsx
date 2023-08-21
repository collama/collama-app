import { Task } from "~/app/(protected)/[workspace]/tasks/components/Task"
import { type PageProps } from "~/common/types/props"

type TaskPageProps = {
  workspace: string
}

export default function TaskPage({ params }: PageProps<TaskPageProps>) {
  return <Task workspaceName={params.workspace} />
}
