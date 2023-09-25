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
  workspaceSlug: string
}
export function MemberOnWorkspace({ workspaceSlug }: Props) {
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
          <Workspace workspaceSlug={workspaceSlug} />
        ) : (
          <Team workspaceSlug={workspaceSlug} />
        )}
      </div>
    </div>
  )
}

const Workspace = ({ workspaceSlug }: Props) => {
  return (
    <>
      <div className="mt-4 space-y-6">
        <div className="rounded-lg border p-6">
          <InviteForm workspaceSlug={workspaceSlug} />
        </div>
        <div>
          <Members workspaceSlug={workspaceSlug} />
        </div>
      </div>
    </>
  )
}

const Team = ({ workspaceSlug }: Props) => {
  return (
    <>
      <div className="mt-4 space-y-6">
        <div className="rounded-lg border p-6">
          <CreateTeamForm workspaceSlug={workspaceSlug} />
        </div>
        <div>
          <Teams workspaceSlug={workspaceSlug} />
        </div>
      </div>
    </>
  )
}
