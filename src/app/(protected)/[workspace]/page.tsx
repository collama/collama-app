import React from "react"
import { type PageProps } from "~/common/types/props"
import { api } from "~/trpc/server-http"

interface Props {
  workspace: string
}

export default function WorkspacePage({ params }: PageProps<Props>) {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
