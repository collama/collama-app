import { getSession } from "~/common/passage"
import * as E from "fp-ts/Either"
import { redirect } from "next/navigation"
import { api } from "~/trpc/server"

interface Props {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  const session = await getSession()()
  if (E.isLeft(session)) {
    console.warn("session", session.left.message)
    redirect("auth")
  }

  const totalWorkspaces = await api.workspace.count.query()
  if (totalWorkspaces > 0) {
    redirect("/")
  }

  return <div>{children}</div>
}
