import { redirect } from "next/navigation"
import urlJoin from "url-join"
import { type PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-http"
import {sleep} from "~/server/api/services/common";

interface NewTaskProps {
  workspace: string
}

export default async function NewTaskPage({ params }: PageProps<NewTaskProps>) {
  const task = await api.task.create.mutate({ slug: params.workspace })

 await sleep(1000)

  redirect(
    urlJoin(
      "/",
      params.workspace,
      task.slug,
      `?&version=${task.taskRevision.version}`
    )
  )
}
