import { useCallback, useState } from "react"
import useAsyncEffect from "use-async-effect"
import { type Updater, useImmer } from "use-immer"

interface AwaitedResult<T> {
  data: T | null | undefined
  error: Error | null
  loading: boolean
  setData: Updater<T | null>
  refresh: () => void
}

export function useAwaitedFn<T>(
  fn: () => Promise<T>,
  deps: unknown[] = []
): AwaitedResult<T> {
  const [data, setData] = useImmer<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fn()
      console.log("data", data)
      setData(data)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setLoading(false)
    }
  }, [fn, setData])

  useAsyncEffect(async () => {
    await fetch()
  }, deps)

  return { data, error, loading, setData, refresh: fetch }
}
