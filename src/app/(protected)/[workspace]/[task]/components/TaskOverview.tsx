import { type TaskIncludeOwner } from "~/common/types/prisma"
import { Execute } from "~/app/(protected)/[workspace]/[task]/components/Execute"

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
