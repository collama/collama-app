import NextAuth from "next-auth/src";

declare module "next-auth" {
  interface Session {
    user: {
      isAuthorized: boolean
      email: string | undefined
      username: string | null | undefined
      userId: string
    }
  }
}
