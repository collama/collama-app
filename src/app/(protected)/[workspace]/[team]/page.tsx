import { Suspense } from "react"
import Loading from "~/ui/loading"
import type { PageProps } from "~/common/types/props"
import Hello from "~/app/(empty)/empty/components/Example"

interface TeamProps {
  workspace: string
  team: string
}

export default function TeamPage({ params }: PageProps<TeamProps>) {
  return (
    <div>
      <h3>{params.team}</h3>
      <section>
        <Suspense fallback={<Loading />}></Suspense>
      </section>
    </div>
  )
}
