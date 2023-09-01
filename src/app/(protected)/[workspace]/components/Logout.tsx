"use client"

import React from "react"
import { Button } from "~/ui/Button"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Logout() {
  const router = useRouter()
  return (
    <Button
      onClick={async () => {
        await signOut({ redirect: false })
        router.push("/auth/sign-in")
      }}
    >
      Logout
    </Button>
  )
}
