import Link from "next/link"
import { type PageProps } from "~/common/types/props"
import { type PropsWithChildren } from "react"

interface Props {
  workspace: string
}

export default function SettingLayout({
  children,
  params,
}: PageProps<Props> & PropsWithChildren) {
  return (
    <div className="flex h-screen">
      <aside className="flex w-[300px] flex-col border-r bg-gray-50">
        <h3>Settings</h3>
        <Link href={`/${params.workspace}/settings`}>General</Link>
        <Link href={`/${params.workspace}/settings/account`}>Account</Link>
        <Link href={`/${params.workspace}/settings/keys`}>API Keys</Link>
        <Link href={`/${params.workspace}/settings/members`}>Members</Link>
      </aside>
      <div className="w-full">{children}</div>
    </div>
  )
}
