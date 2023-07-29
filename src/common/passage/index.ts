import Passage from "@passageidentity/passage-node"
import { env } from "~/env.mjs"
import { cookies } from "next/headers"
import cookie from "cookie"
import * as TE from "fp-ts/TaskEither"
import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/function"
import { TokenNotFound, UserNotFound } from "~/common/errors"

export const passage = new Passage({
  appID: env.NEXT_PUBLIC_PASSAGE_APP_ID,
  apiKey: env.PASSAGE_API_KEY,
  authStrategy: "HEADER",
})

export interface Session {
  isAuthorized: boolean
  email: string
  userId: string
  role: string
}

const newRequest = (token: string): Request => {
  return {
    headers: {
      authorization: `Bearer ${token}`,
    },
  } as never
}

const authenticateRequest = TE.tryCatchK(
  (req: Request) => passage.authenticateRequest(req as never),
  () => TokenNotFound
)
const getUser = TE.tryCatchK(
  (id: string) => passage.user.get(id),
  () => UserNotFound
)

const _getSession = (
  token: O.Option<string>
): TE.TaskEither<Error, Session> => {
  return pipe(
    token,
    TE.fromOption(() => TokenNotFound),
    TE.map(newRequest),
    TE.chain((req) => authenticateRequest(req)),
    TE.chain((id) => getUser(id)),
    // TODO: check user_id and role later
    TE.map(
      (user) =>
        ({
          isAuthorized: true,
          email: user.email,
          userId: user.user_metadata?.user_id!!,
          role: user.user_metadata?.role!!,
        } as Session)
    )
  )
}

const extractTokenFromCookie = (): O.Option<string> => {
  return pipe(
    O.of(cookies()),
    O.chain((v) => O.fromNullable(v.get("psg_auth_token"))),
    O.chain((v) => O.some(v.value))
  )
}

const extractTokenFromReq = (req: Request): O.Option<string> => {
  return pipe(
    O.fromNullable(req.headers.get("cookie")),
    O.map((rawCookies) => cookie.parse(rawCookies)),
    O.chain((requestCookies) => O.fromNullable(requestCookies.psg_auth_token))
  )
}

const extractToken = (req: O.Option<Request>) =>
  pipe(req, O.match(extractTokenFromCookie, extractTokenFromReq))

export const getSession = (req?: Request): TE.TaskEither<Error, Session> => {
  return pipe(O.fromNullable(req), extractToken, _getSession)
}
