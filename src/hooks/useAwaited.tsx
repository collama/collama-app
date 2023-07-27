import { useState } from "react"
import useAsyncEffect from "use-async-effect"

interface AwaitedResult<T> {
  data: T | null | undefined
  error: Error | null
  loading: boolean
}

export default function useAwaited<T>(fn: Promise<T>): AwaitedResult<T> {
  const [data, setData] = useState<T | null>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useAsyncEffect(async () => {
    try {
      setLoading(true)
      const data = await fn
      setData(data)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, error, loading }
}
