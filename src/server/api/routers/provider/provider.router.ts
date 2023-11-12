import * as apiKeyService from "../provider/provider.service"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

const getAll = protectedProcedure.query(({ ctx }) => {
  return apiKeyService.getAll(ctx.prisma)
})

export const providerTRPCRouter = createTRPCRouter({ getAll })
