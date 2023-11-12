"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "~/ui/Button"

export function Logout() {
  const router = useRouter()
  return (
    <Button
      onClick={async () => {
        await signOut({ redirect: false })
        router.replace("/auth/sign-in")
      }}
    >
      Logout
    </Button>
  )
}
