import { Suspense } from "react"
import Loading from "~/ui/loading"
import { InsertApiKey } from "~/app/(protected)/[workspace]/settings/components/InsertApiKey"
import { Keys } from "~/app/(protected)/[workspace]/settings/components/Keys"

export default function Settings() {
  return (
    <div className="p-6">
      <div className='mb-4'>
        <h2 className="text-xl font-bold">API Key</h2>
      </div>
      <div className='space-y-4'>
        <Suspense fallback={<Loading />}>
          <InsertApiKey />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <Keys />
        </Suspense>
      </div>
    </div>
  )
}
