"use client"

import { type FC } from "react"
import { ChatExecute } from "~/app/(protected)/[workspace]/[task]/components/ChatExecute"
import { type TaskRevisionProps } from "~/app/(protected)/[workspace]/[task]/page"

export const Executes: FC<TaskRevisionProps> = ({ taskRevision }) => {
  return (
    <div>
      <div className="w-full px-4 py-2 text-left font-medium">Chat</div>
      <ChatExecute taskRevision={taskRevision} />
    </div>
  )
}
