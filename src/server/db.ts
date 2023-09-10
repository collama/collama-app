import { PrismaClient } from "@prisma/client"
import { env } from "~/env.mjs"
import { callbackFreeTx } from "~/server/extensions/callback-free-tx"
import { inviteUserToTaskExtension } from "~/server/extensions/invite"
import { pagination } from "~/server/extensions/pagination"

const _prisma = () =>
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
    .$extends(callbackFreeTx)
    .$extends(inviteUserToTaskExtension)
    .$extends(pagination)

type ExtendedPrismaClient = ReturnType<typeof _prisma>

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? _prisma()

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
