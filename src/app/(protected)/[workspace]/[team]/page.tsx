import { Suspense } from "react"
import Loading from "~/ui/loading"
import type { PageProps } from "~/common/types/props"
import { Tasks } from "~/app/(protected)/[workspace]/[team]/components/Tasks"
import Link from "next/link";

interface TeamProps {
  workspace: string
  team: string
}

export default function TeamPage({ params }: PageProps<TeamProps>) {
  return (
    <div>
      <h3>{params.team}</h3>
      <div>
        <Link href={`/${params.workspace}/${params.team}/settings`}>Settings</Link>
      </div>

      <section>
        <Suspense fallback={<Loading />}>
          <Tasks />
        </Suspense>
      </section>
    </div>
  )
}
