import type { ExtendedPrismaClient } from "~/server/db"

export const getAll = async (prisma: ExtendedPrismaClient) => {
  return prisma.provider.findMany()
}
