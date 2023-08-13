import { createContext, type PropsWithChildren } from "react"
import { getSession, type Session } from "~/common/passage"
import type * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"

interface AuthContextProps {
  session: O.Option<E.Either<Error, Session>>
}

export const AuthContext = createContext<AuthContextProps>({
  session: O.none,
})

export default async function AuthContextProvider({
  children,
}: PropsWithChildren) {
  const session = await getSession()()

  return (
    <AuthContext.Provider value={{ session: O.some(session) }}>
      {children}
    </AuthContext.Provider>
  )
}
