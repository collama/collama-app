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
        ownerId: ctx.session.right.userId,
      },
    })
  })

export const apiKeyRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.apiKey.findMany({
      where: {
        owner: {
          email: ctx.session.right.email,
        },
      },
    })
  }),
})
