import { type ReactNode } from "react"
import { Heading } from "~/components/Heading"

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-y-hidden">
      <div className="flex">
        <Heading />
      </div>
      <div className="flex h-[80vh] w-full justify-center pt-10">
        <div>{children}</div>
      </div>
    </div>
  )
}
