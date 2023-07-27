"use client"

import { PassageUser } from "@passageidentity/passage-elements/passage-user"
import { useRouter } from "next/navigation"

export default function LogoutForm() {
  const router = useRouter()

  return (
    <div>
      <button
        onClick={async () => {
          const user = new PassageUser()
          await user.signOut()
          router.push("/auth")
        }}
      >
        Sign out
      </button>
    </div>
  )
}
