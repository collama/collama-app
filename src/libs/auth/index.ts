import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "~/server/db"
import { type PrismaClient } from "@prisma/client"
import { type Adapter, type User } from "next-auth/adapters"
import Credentials from "next-auth/providers/credentials"
import { env } from "~/env.mjs"
import ms from "ms"
import { type AuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import dayjs from "dayjs"
import { randomUUID } from "crypto"
import { type Session } from "next-auth"
import crypto from "crypto"
import { NextApiRequest, NextApiResponse } from "next"

const adapter = PrismaAdapter(
  prisma as unknown as PrismaClient
) as Required<Adapter>
const maxAge = env.NODE_ENV === "production" ? ms("30 days") : ms("30 days")

export const nextAuthOptions: AuthOptions = {
  adapter,
  session: {
    strategy: "jwt",
    maxAge,
    updateAge: ms("24 hours"),
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
        console.log("credentials", credentials)
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
          expires: dayjs().add(maxAge, "ms").toDate(),
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
