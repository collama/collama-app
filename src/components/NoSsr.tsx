import dynamic from "next/dynamic"
import { type PropsWithChildren } from "react"

const NoSsr = ({ children }: PropsWithChildren) => <>{children}</>

export const NoSsrWarp = dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
})
