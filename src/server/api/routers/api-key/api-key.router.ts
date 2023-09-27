import * as apiKeyService from "~/server/api/routers/api-key/api-key.service"
import {
  CreateApiKeyInput,
  DeleteApiKeyInput,
} from "~/server/api/routers/api-key/dto/api-key.input"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const createApiKey = protectedProcedure
  .input(CreateApiKeyInput)
  .mutation(async ({ ctx, input }) => {
    return apiKeyService.createApiKey(input, ctx.session)
  })

export const getAll = protectedProcedure.query(async ({ ctx }) => {
  return apiKeyService.getAll(ctx.session)
})

export const deleteApiKeyById = protectedProcedure
  .input(DeleteApiKeyInput)
  .mutation(async ({ input }) => {
    return apiKeyService.deleteApiKeyById(input)
  })

export const apiKeyTRPCRouter = createTRPCRouter({ getAll })
