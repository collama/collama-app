import {} from "next-auth/react"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "~/server/db"
import { compare } from "bcrypt"
import { z } from "zod"
import { type NextAuthOptions } from "next-auth"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const nextAuthOptions: NextAuthOptions = {
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
        const creds = await loginSchema.parseAsync(credentials)

        const user = await prisma.user.findFirst({
          where: { email: creds.email },
        })

        if (!user) {
          return null
        }

        const isValidPassword = await compare(creds.password, user.password)

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
      }

      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          email: token.email as string | undefined,
          username: token.name,
          userId: token.id as string,
        }
      }

      return session
    },
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  debug: process.env.NODE_ENV === "production",
}
