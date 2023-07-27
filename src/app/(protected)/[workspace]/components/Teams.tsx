import { api } from "~/trpc/server-invoker"
import Link from "next/link"

interface TeamsProps {
  workspace: string
}

export default async function Teams({ workspace }: TeamsProps) {
  const teams = await api.team.getAll.query()

  return (
    <div>
      {teams.map((team) => (
        <div key={team.id}>
          <Link href={`/${workspace}/${team.team.name}`} key={team.id}>
            {team.team.name}
          </Link>
        </div>
      ))}
    </div>
  )
}
