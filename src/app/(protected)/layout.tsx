import { redirect } from "next/navigation"
import { getSession } from "~/common/passage"
import * as E from "fp-ts/Either"
import type { PropsWithChildren } from "react"
import { api } from "~/trpc/server-invoker"

export const metadata = {
  title: "Collama",
  description: "Make AI is easier",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getSession()()
  if (E.isLeft(session)) {
    redirect("/auth")
  }

  const totalWorkspaces = await api.workspace.count.query()
  if (totalWorkspaces === 0) {
    redirect("/onboarding")
  }

  return <div>{children}</div>
}
