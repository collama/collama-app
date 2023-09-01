"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Logout() {
  const router = useRouter()
  return (
    <div>
      <button
        onClick={async () => {
          await signOut({
            redirect: false,
          })

          router.push("/auth/sign-in")
        }}
      >
        Logout
      </button>
    </div>
  )
}
