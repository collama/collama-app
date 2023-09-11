import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { Provider } from "@prisma/client"
import Cryptr from "cryptr"
import { env } from "~/env.mjs"

const cryptr = new Cryptr(env.ENCRYPTION_KEY)

const createHint = (value: string) =>
  value.slice(0, 3) +
  "*".repeat(value.length - 6) +
  value.slice(value.length - 3)

export const createApiKey = protectedProcedure
  .input(
    z.object({
      provider: z.enum([Provider.OpenAI, Provider.Cohere]),
      title: z.string().nonempty(),
      value: z.string().nonempty(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.apiKey.create({
      data: {
        provider: input.provider,
        title: input.title,
        value: cryptr.encrypt(input.value),
        hint: createHint(input.value),
        ownerId: ctx.session.user.id,
      },
    })
  })

export const apiKeyRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.apiKey.findMany({
      where: {
        owner: {
          id: ctx.session.user.id,
        },
      },
      include: {
        owner: true,
      },
    })
  }),
})

export const deleteApiKey = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.apiKey.delete({
      where: {
        id: input.id,
      },
    })
  })
