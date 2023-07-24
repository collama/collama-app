import { redirect } from "next/navigation"
import { PageProps } from "~/common/types/props"

interface Props {
  workspace: string
}

export default function Settings({ params }: PageProps<Props>) {
  redirect(`/${params.workspace}/settings/account`)
  return null
}
