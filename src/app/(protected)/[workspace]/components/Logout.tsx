"use client"

import React from "react"
import { Button } from "~/ui/Button"
import { signOut } from "next-auth/react"

export function Logout() {
  return <Button onClick={signOut}>Logout</Button>
}
