"use client"

import React, { useState } from "react"
import { type InviteMemberToTaskProps } from "~/app/(protected)/[workspace]/[task]/components/InviteMemberToTask"
import { TaskMember } from "~/app/(protected)/[workspace]/[task]/components/TaskMember"
import { TaskOverview } from "~/app/(protected)/[workspace]/[task]/components/TaskOverview"
import type { TaskIncludeOwner } from "~/common/types/prisma"
import { Button } from "~/ui/Button"

interface Props extends InviteMemberToTaskProps {
  task: TaskIncludeOwner
}

enum Tab {
  Task,
  Member,
}

export const ClientTask = ({ task }: Props) => {
  const [tab, setTab] = useState(Tab.Task)

  return (
    <div className="p-6">
      <section className="mb-4 space-x-4">
        <Button
          type={tab === Tab.Task ? "primary" : "default"}
          onClick={() => setTab(Tab.Task)}
        >
          Task
        </Button>
        <Button
          type={tab === Tab.Member ? "primary" : "default"}
          onClick={() => setTab(Tab.Member)}
        >
          Member
        </Button>
      </section>
      {tab === Tab.Task ? (
        <TaskOverview task={task} />
      ) : (
        <TaskMember task={task} />
      )}
    </div>
  )
}
