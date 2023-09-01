"use client"

import useAwaited from "~/hooks/useAwaited"
import { api } from "~/trpc/client"
import { type TeamByNamePageParams } from "~/app/(protected)/[workspace]/teams/[team]/page"

export const Members = ({ teamId, workspaceName }: TeamByNamePageParams) => {
  const { data } = useAwaited(
    api.team.membersOnTeam.query({ teamId, workspaceName })
  )

  return (
    <div className="mt-6">
      <div className="mb-2">
        <h3 className="text-xl">Team member: </h3>
      </div>
      <ul>
        {(data ?? []).map((member) => (
          <li key={member.id}>
            {member.user.email} - {member.role}
          </li>
        ))}
      </ul>
    </div>
  )
}
