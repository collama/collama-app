import { type ISODateString } from "next-auth/src/core/types"

declare module "next-auth" {
  export interface Session {
    user: {
      name: string
      email: string
      id: string
    }
    expires: ISODateString
  }
}

declare module "next-auth/adapters" {
  export interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    sessionToken: string
  }
}
