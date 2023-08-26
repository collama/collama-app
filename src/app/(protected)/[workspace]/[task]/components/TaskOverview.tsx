import { type TaskIncludeOwner } from "~/common/types/prisma"
import { Execute } from "~/app/(protected)/[workspace]/[task]/components/Execute"

export const TaskOverview = ({ task }: { task: TaskIncludeOwner }) => {
  return (
    <div>
      <Execute task={task} />
    </div>
  )
}
