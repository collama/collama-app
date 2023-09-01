import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "~/server/db"
import { type PrismaClient } from "@prisma/client"
import { type Adapter, type User } from "next-auth/adapters"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { env } from "~/env.mjs"
import ms from "ms"
import { type AuthOptions } from "next-auth/src"
import { getServerSession, type Session } from "next-auth"
import dayjs from "dayjs"
import { randomUUID } from "crypto"

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

        const isValidPassword = await compare(
          credentials.password,
          user.password
        )

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
  debug: env.NODE_ENV === "production",
}

export const getAuthSession = async (): Promise<Session | null> => {
  return getServerSession(nextAuthOptions)
}
