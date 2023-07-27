import "~/styles/globals.css"
import { Inter } from "next/font/google"
import { type PropsWithChildren } from "react"

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        {children}
      </body>
    </html>
  )
}
