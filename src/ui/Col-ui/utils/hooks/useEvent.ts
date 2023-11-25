import { useCallback, useRef } from "react"

export default function useEvent<T extends Function>(callback: T): T {
  const fnRef = useRef<any>()
  fnRef.current = callback

  return useCallback<T>(((...args: any) => fnRef.current?.(...args)) as any, [])
}
