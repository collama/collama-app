import NextAuth from "next-auth"
import { nextAuthOptions } from "~/common/auth"

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }
