import "~/styles/globals.css"
import { Inter } from "next/font/google"
import { type PropsWithChildren } from "react"
import { NextAuthProvider } from "~/context/NextAuthProvider"

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Collama",
  description: "Unified collaboration LLM platform",
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  )
}
