"use client"

import useAwaited from "~/hooks/useAwaited"
import { api } from "~/trpc/client"

export const Members = ({ teamId }: { teamId: string }) => {
  const { data } = useAwaited(api.team.membersOnTeam.query({ teamId }))

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
