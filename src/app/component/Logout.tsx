"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "~/ui/Button"

export function Logout() {
  const router = useRouter()
  return (
    <div>
      <Button
        onClick={async () => {
          await signOut({
            redirect: false,
          })

          router.push("/auth/sign-in")
        }}
      >
        Logout
      </Button>
    </div>
  )
}
