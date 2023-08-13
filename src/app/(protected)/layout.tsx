import type { PropsWithChildren } from "react"

export const metadata = {
  title: "Collama",
  description: "Make AI is easier",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({ children }: PropsWithChildren) {
  return <div>{children}</div>
}
