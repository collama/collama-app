"use client"

import React, { useState } from "react"
import { InviteForm } from "~/app/(protected)/[workspace]/components/InviteForm"
import { Members } from "~/app/(protected)/[workspace]/components/Members"
import { CreateTeamForm } from "~/app/(protected)/[workspace]/components/Team/CreateTeamForm"
import { Teams } from "~/app/(protected)/[workspace]/components/Team/Teams"
import { Button } from "~/ui/Button"

enum Tab {
  Workspace,
  Team,
}

interface Props {
  workspaceName: string
}
export function MemberOnWorkspace({ workspaceName }: Props) {
  const [tab, setTab] = useState(Tab.Workspace)

  return (
    <div className="p-6">
      <section className="space-x-4">
        <Button
          type={tab === Tab.Workspace ? "primary" : "default"}
          onClick={() => setTab(Tab.Workspace)}
        >
          Workspace
        </Button>
        <Button
          type={tab === Tab.Team ? "primary" : "default"}
          onClick={() => setTab(Tab.Team)}
        >
          Team
        </Button>
      </section>
      <div className="mt-2">
        {tab === Tab.Workspace ? (
          <Workspace workspaceName={workspaceName} />
        ) : (
          <Team workspaceName={workspaceName} />
        )}
      </div>
    </div>
  )
}

const Workspace = ({ workspaceName }: Props) => {
  return (
    <>
      <div className="mt-4 space-y-6">
        <div className="rounded-lg border p-6">
          <InviteForm workspaceName={workspaceName} />
        </div>
        <div>
          <Members workspaceName={workspaceName} />
        </div>
      </div>
    </>
  )
}

const Team = ({ workspaceName }: Props) => {
  return (
    <>
      <div className="mt-4 space-y-6">
        <div className="rounded-lg border p-6">
          <CreateTeamForm workspaceName={workspaceName} />
        </div>
        <div>
          <Teams workspaceName={workspaceName} />
        </div>
      </div>
    </>
  )
}
