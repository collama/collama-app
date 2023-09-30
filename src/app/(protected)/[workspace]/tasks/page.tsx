import { Suspense } from "react"
import { Tasks } from "~/app/(protected)/[workspace]/tasks/components/Tasks"
import { type PageProps } from "~/common/types/props"
import Loading from "~/ui/loading"

type TaskPageProps = {
  workspace: string
}

export default function TaskPage({ params }: PageProps<TaskPageProps>) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Tasks workspaceSlug={params.workspace} />
      </Suspense>
    </div>
  )
}
