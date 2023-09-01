"use client"

import { SessionProvider } from "next-auth/react"
import { type ReactNode } from "react"

export function NextAuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
