import type { Session } from "next-auth"
import type { z } from "zod"
import { cryptoTr } from "~/server/api/providers/crypto-provider"
import type { CreateApiKeyInput } from "~/server/api/routers/api-key/dto/api-key.input"
import type { DeleteApiKeyInput } from "~/server/api/routers/api-key/dto/api-key.input"
import { prisma } from "~/server/db"

const createHint = (value: string) =>
  value.slice(0, 3) +
  "*".repeat(value.length - 6) +
  value.slice(value.length - 3)

export const createApiKey = (
  input: z.infer<typeof CreateApiKeyInput>,
  session: Session
) =>
  prisma.apiKey.create({
    data: {
      provider: input.provider,
      title: input.title,
      value: cryptoTr.encrypt(input.value),
      hint: createHint(input.value),
      ownerId: session.user.id,
    },
  })

export const deleteApiKeyById = (input: z.infer<typeof DeleteApiKeyInput>) =>
  prisma.apiKey.delete({
    where: {
      id: input.id,
    },
  })

export const getAll = (session: Session) =>
  prisma.apiKey.findMany({
    where: {
      owner: {
        id: session.user.id,
      },
    },
    include: {
      owner: true,
    },
  })
