import { Suspense } from "react"
import Loading from "~/ui/loading"
import type { PageProps } from "~/common/types/props"
import { Tasks } from "~/app/(protected)/[workspace]/[team]/components/Tasks"
interface TeamProps {
  workspace: string
  team: string
}

export default function TeamPage({ params }: PageProps<TeamProps>) {
  return (
    <div>
      <h3>{params.team}</h3>

      <section>
        <Suspense fallback={<Loading />}>
          <Tasks />
        </Suspense>
      </section>
    </div>
  )
}
