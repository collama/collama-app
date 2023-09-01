import NextAuth from "next-auth"
import { nextAuthOptions } from "~/libs/auth"

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }
