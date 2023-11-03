"use client"

import { type FC } from "react"
import { ChatExecute } from "~/app/(protected)/[workspace]/[task]/components/ChatExecute"
import { type TaskRevisionProps } from "~/app/(protected)/[workspace]/[task]/page"
import { useTaskStoreVariables } from "~/store/taskStore"

export const Executes: FC<TaskRevisionProps> = ({ taskRevision }) => {
  const variables = useTaskStoreVariables()

  return (
    <div>
      <div>ChatExecute</div>
      <ChatExecute variables={variables} taskRevision={taskRevision} />
    </div>
  )
}
