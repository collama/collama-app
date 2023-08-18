"use client"

import useAwaited from "~/hooks/useAwaited"
import { api } from "~/trpc/client"
import Loading from "~/ui/loading"

interface Props {
  workspaceName: string
}

export const Teams = (props: Props) => {
  const {
    data: teams,
    loading,
    setData: setTeams,
  } = useAwaited(
    api.team.teamsOnWorkspace.query({
      workspaceName: props.workspaceName,
    })
  )

  if (loading) {
    return <Loading />
  }

  if (!Array.isArray(teams) || teams.length === 0) {
    return <div>Empty</div>
  }

  return (
    <div>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} - {team.description}
          </li>
        ))}
      </ul>
    </div>
  )
}