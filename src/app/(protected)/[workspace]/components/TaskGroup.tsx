import Tasks from "~/app/(protected)/[workspace]/components/Tasks"
import { Suspense } from "react"
import Loading from "~/ui/loading"

interface Props {
  workspaceName: string
}

export default function TaskGroup({ workspaceName }: Props) {
  return (
    <div className="w-full p-2 py-2">
      <div className="p-2">
        <div className="text-xs font-medium">Tasks</div>
        <div className="text-xs font-medium">View all</div>
        <Suspense fallback={<Loading />}>
          <Tasks workspaceName={workspaceName} />
        </Suspense>
      </div>
    </div>
  )
}
