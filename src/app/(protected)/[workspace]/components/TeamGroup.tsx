import Link from "next/link"
import { Suspense } from "react"
import Loading from "~/ui/loading"
import Teams from "~/app/(protected)/[workspace]/components/Teams"

interface Props {
  workspace: string
}

export default function TeamGroup({ workspace }: Props) {
  return (
    <div className="py-2">
      <div className="p-2">
        <span className="text-xs font-medium">Teams</span>
        <div>
          <Link className="underline" href={`/${workspace}/teams/new`}>
            New Team
          </Link>
        </div>
        <Suspense fallback={<Loading />}>
          <Teams workspace={workspace} />
        </Suspense>
      </div>
    </div>
  )
}
