import { type DeepMockProxy, mockDeep } from "jest-mock-extended"
import type { ExtendedPrismaClient } from "~/server/db"

export type MockContext = {
  prisma: DeepMockProxy<ExtendedPrismaClient>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<ExtendedPrismaClient>(),
  }
}
