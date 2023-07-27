import { useState } from "react"
import useAsyncEffect from "use-async-effect"

export default function useQuery<T>(fn: Promise<T>) {
  const [state, setState] = useState<T | null>()

  useAsyncEffect(async () => {
    const values = await fn
    setState(values)
  }, [])

  return state
}
