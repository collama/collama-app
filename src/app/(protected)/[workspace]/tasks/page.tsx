import { Tasks } from "~/app/(protected)/[workspace]/tasks/components/Tasks"
import { type PageProps } from "~/common/types/props"

type TaskPageProps = {
  workspace: string
}

export default function TaskPage({ params }: PageProps<TaskPageProps>) {
  return <Tasks workspaceSlug={params.workspace} />
}
