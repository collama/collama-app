import Link from "next/link"
import { api } from "~/trpc/server-invoker"

interface MembersProps {
  team: string
}

export default async function Members({ team }: MembersProps) {
  const members = await api.team.getMembersByTeam.query({
    team,
  })

  if (members.length === 0) {
    return <div className="text-gray-400">Empty tasks</div>
  }

  return (
    <div>
      <ul>
        {members.map((member) => (
          <li className="underline" key={member.id}>
            <Link href={`/users/${member.user.id}`}>
              {member.user.email} - {member.role} - {member.status}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
