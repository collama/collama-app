import { Spin } from "~/ui/Spinner"

export default function Loading() {
  return (
    <div className="h-[80vh] w-[90vw] flex items-center justify-center">
      <div className="flex flex-col gap-y-6 justify-center items-center">
        <p>Creating task ...</p>
        <Spin size="lg" />
      </div>
    </div>
  )
}
