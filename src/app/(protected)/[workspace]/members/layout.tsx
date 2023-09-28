import Link from "next/link"
import { type PropsWithChildren } from "react"
import urlJoin from "url-join"
import { type PageProps } from "~/common/types/props"

interface Props {
  workspace: string
  team: string
}

export default function Layout({
  params,
  children,
}: PageProps<Props> & PropsWithChildren) {
  return (
    <div>
      <div>
        <Link href={urlJoin("/", params.workspace, "members")}>Members</Link>
      </div>
      <div>
        <Link href={urlJoin("/", params.workspace, "members", "teams")}>
          Teams
        </Link>
      </div>
      {children}
    </div>
  )
}
