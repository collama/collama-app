import * as modelService from "./model.service"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

const getAll = protectedProcedure.query(({ ctx }) => {
  return modelService.getAll(ctx.prisma)
})

export const modelTRPCRouter = createTRPCRouter({ getAll })
