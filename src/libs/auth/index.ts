import { PrismaAdapter } from "@auth/prisma-adapter"
import { type PrismaClient } from "@prisma/client"
import crypto, { randomUUID } from "crypto"
import dayjs from "dayjs"
import { type NextApiRequest, type NextApiResponse } from "next"
import { type AuthOptions, type Session } from "next-auth"
import { type Adapter, type User } from "next-auth/adapters"
import { getServerSession } from "next-auth/next"
import Credentials from "next-auth/providers/credentials"
import { env } from "~/env.mjs"
import { seconds } from "~/libs/seconds"
import { prisma } from "~/server/db"

export const adapter = PrismaAdapter(
  prisma as unknown as PrismaClient
) as Required<Adapter>
const maxAge = seconds("1 day")

export const nextAuthOptions: AuthOptions = {
  adapter,
  session: {
    strategy: "jwt",
    maxAge,
  },
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        const hash = crypto
          .pbkdf2Sync(credentials.password, user.salt, 1000, 64, "sha512")
          .toString(`hex`)
        const isValidPassword = hash === user.password

        if (!isValidPassword) {
          return null
        }

        const token = randomUUID()
        await adapter.createSession({
          userId: user.id,
          expires: dayjs().add(maxAge, "seconds").toDate(),
          sessionToken: token,
        })

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          sessionToken: token,
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      }
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.sessionToken = (user as unknown as User).sessionToken
      }

      if (token?.sessionToken) {
        const sessionAndUser = await adapter.getSessionAndUser(
          token.sessionToken as string
        )

        if (!sessionAndUser?.session) {
          return token
        }
      }

      return token
    },
  },
  events: {
    signOut: async ({ token }) => {
      if (token?.sessionToken) {
        await adapter.deleteSession(token.sessionToken as string)
      }
    },
  },
  debug: env.NODE_ENV !== "production",
  logger: {
    error(code, metadata) {
      console.error(code, metadata)
    },
    warn(code) {
      console.warn(code)
    },
    debug(code, metadata) {
      console.debug(code, metadata)
    },
  },
}

export const getAuthSession = async (
  req?: NextApiRequest,
  res?: NextApiResponse
): Promise<Session | null> => {
  if (req && res) {
    return getServerSession(req, res, nextAuthOptions)
  }

  return getServerSession(nextAuthOptions)
}
