import type { ExtendedPrismaClient } from "~/server/db"

export const getAll = async (prisma: ExtendedPrismaClient) => {
  return prisma.model.findMany({
    select: { id: true, name: true, description: true, parameterSchema: true },
  })
}
