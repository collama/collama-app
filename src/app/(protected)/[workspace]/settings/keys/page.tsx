import Link from "next/link"
import { PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-invoker"

interface Props {
  workspace: string
}

export default async function KeysPage({ params }: PageProps<Props>) {
  const keys = await api.apiKey.getAll.query()
  return (
    <div className="p-4">
      <h3>API Keys page</h3>
      <Link href={`/${params.workspace}/settings/keys/new`}>New</Link>

      <div>
        {keys.map((k) => (
          <div key={k.id}>
            {k.title} - {k.hint}
          </div>
        ))}
      </div>
    </div>
  )
}
