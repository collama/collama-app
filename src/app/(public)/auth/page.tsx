"use client"

import { useEffect, useState } from "react"
import { env } from "~/env.mjs"
import type { PassageElement } from "@passageidentity/passage-elements"
import { PassageUser } from "@passageidentity/passage-elements/passage-user"
import { api } from "~/trpc/client"

export default function Auth() {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    require("@passageidentity/passage-elements/passage-auth")
    const passageAuth = document.querySelector<PassageElement>("passage-auth")
    if (!passageAuth) return

    passageAuth.onSuccess = async (authResult): Promise<void> => {
      try {
        setLoading(true)
        document.cookie = `psg_auth_token=${authResult.auth_token};path=/`
        const urlParams = new URLSearchParams(window.location.search)
        const magicLink = urlParams.has("psg_magic_link")
          ? urlParams.get("psg_magic_link")
          : null

        if (magicLink !== null) {
          window.location.href = authResult.redirect_url
          return
        }

        const user = new PassageUser(authResult.auth_token)
        const info = await user.userInfo()
        if (!info) {
          throw new Error("user does not exist")
        }

        await api.user.createIfNotExists.mutate({
          passageId: info.id,
          email: info.email,
          username: "test",
          phone: info.phone,
        })

        window.location.href = authResult.redirect_url
      } catch (e) {
        throw e
      } finally {
        setLoading(false)
      }
    }
  }, [])

  if (loading) {
    return (
      <main>
        <div>Loading...</div>
      </main>
    )
  }

  return (
    <main>
      <passage-auth app-id={env.NEXT_PUBLIC_PASSAGE_APP_ID}></passage-auth>
    </main>
  )
}
