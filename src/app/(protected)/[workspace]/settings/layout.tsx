import { type PropsWithChildren } from "react"

export default function SettingLayout({ children }: PropsWithChildren) {
  return (
    <>{children}</>
    // <div className="flex h-screen">
    //   <aside className="flex w-[300px] flex-col border-r bg-gray-50">
    //     <h3>Settings</h3>
    //     <Link href={`/${params.workspace}/settings`}>General</Link>
    //     <Link href={`/${params.workspace}/settings/account`}>Account</Link>
    //     <Link href={`/${params.workspace}/settings/keys`}>API Keys</Link>
    //   </aside>
    //   <div className="w-full">{children}</div>
    // </div>
  )
}
