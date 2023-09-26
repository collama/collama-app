import { useState } from "react"
import useAsyncEffect from "use-async-effect"
import { type Updater, useImmer } from "use-immer"

interface AwaitedResult<T> {
  data: T | null | undefined
  error: Error | null
  loading: boolean
  setData: Updater<T | null>
}

export default function useAwaited<T>(fn: Promise<T>): AwaitedResult<T> {
  const [data, setData] = useImmer<T | null>(null)
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

  return { data, error, loading, setData }
}

export function useAwaitedFn<T>(
  fn: () => Promise<T>,
  deps: unknown[]
): AwaitedResult<T> {
  const [data, setData] = useImmer<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useAsyncEffect(async () => {
    try {
      setLoading(true)
      const data = await fn()
      setData(data)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setLoading(false)
    }
  }, deps)

  return { data, error, loading, setData }
}
