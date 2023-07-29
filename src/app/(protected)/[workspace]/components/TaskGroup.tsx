import Link from "next/link"
import { Suspense } from "react"
import Loading from "~/ui/loading"
import Teams from "~/app/(protected)/[workspace]/components/Teams"

interface Props {}

export default function TaskGroup({}: Props) {
  return (
    <div className="w-full p-2 py-2">
      <div className="p-2">
        <div className="text-xs font-medium">Tasks</div>
        <div className="text-xs font-medium">View all</div>
      </div>
    </div>
  )
}
