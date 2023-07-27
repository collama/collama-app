import { api } from "~/trpc/server-invoker"
import { type PageProps } from "~/common/types/props"

interface Props {
  workspace: string
}

export default async function MemberSettingsPage({ params }: PageProps<Props>) {
  const members = await api.workspace.getMembers.query({
    workspaceName: params.workspace,
  })

  console.log(members)

  return (
    <div>
      <h1>Members</h1>
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            {m.user.email} - {m.role}
          </li>
        ))}
      </ul>
    </div>
  )
}
