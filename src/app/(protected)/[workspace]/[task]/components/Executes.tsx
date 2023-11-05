"use client"

import { type FC } from "react"
import { ChatExecute } from "~/app/(protected)/[workspace]/[task]/components/ChatExecute"
import { type TaskRevisionProps } from "~/app/(protected)/[workspace]/[task]/page"


export const Executes: FC<TaskRevisionProps> = ({ taskRevision }) => {

  return (
    <div>
      <div>ChatExecute</div>
      <ChatExecute taskRevision={taskRevision} />
    </div>
  )
}
