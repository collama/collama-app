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
      <aside className="flex flex-col w-[300px] bg-gray-50 border-r">
        <h3>Settings</h3>
        <Link href={`/${params.workspace}/settings/account`}>Account</Link>
        <Link href={`/${params.workspace}/settings/keys`}>API Keys</Link>
      </aside>
      <div className="w-full">{children}</div>
    </div>
  )
}
