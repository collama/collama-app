import { Execute } from "~/app/(protected)/[workspace]/[task]/components/Execute"
import { type TaskIncludeOwner } from "~/common/types/prisma"

interface Props {
  task: TaskIncludeOwner
}

export const TaskOverview = ({ task }: Props) => {
  return (
    <div>
      <Execute task={task} />
    </div>
  )
}
