import { redirect } from "next/navigation"
import urlJoin from "url-join"
import { type PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-http"

interface NewTaskProps {
  workspace: string
}

export default async function NewTaskPage({ params }: PageProps<NewTaskProps>) {
  const task = await api.task.create.mutate({ slug: params.workspace })

  redirect(
    urlJoin(
      "/",
      params.workspace,
      task.slug,
      `?&version=${task.taskRevision.version}`
    )
  )
}
