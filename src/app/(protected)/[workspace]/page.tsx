import { api } from "~/trpc/server-invoker"
import { type PageProps } from "~/common/types/props"

interface Props {
  workspace: string
}

export default async function WorkspacePage({ params }: PageProps<Props>) {
  const workspace = await api.workspace.getByNamePublic.query({
    workspaceName: params.workspace,
  })
  console.log("workspace", workspace)
  if (!workspace) {
    return <h1>Not found</h1>
  }

  return <h1>Hello</h1>
}
