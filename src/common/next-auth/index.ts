import * as O from "fp-ts/Option"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import { TokenNotFound } from "~/common/errors"
import { getServerSession, type Session } from "next-auth"
import { nextAuthOptions } from "~/common/auth"

export const getAuthSession = async (): Promise<E.Either<Error, Session>> => {
  const token = await getServerSession(nextAuthOptions)
  const opToken = pipe(
    O.fromNullable(token),
    O.map((token) => token)
  )
  return pipe(
    opToken,
    E.fromOption(() => TokenNotFound),
    E.map((session) => session)
  )
}
