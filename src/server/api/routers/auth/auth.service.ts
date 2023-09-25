import type { z } from "zod"
import type { signUpInput } from "~/server/api/routers/auth/dto/signUpInput"
import { UserExisted } from "~/libs/constants/errors"
import { env } from "~/env.mjs"
import { prisma } from "~/server/db"

export const signUp = async (input: z.infer<typeof signUpInput>) => {
  const user = await prisma.user.findFirst({
    where: {
      email: input.email,
    },
  })

  if (user) {
    throw UserExisted
  }

  const hashPassword = await Bun.password.hash(input.password, {
    algorithm: "bcrypt",
    cost: env.SALT_ROUND,
  })

  return prisma.user.create({
    data: {
      email: input.email,
      username: input.username.toLowerCase(),
      password: hashPassword,
    },
  })
}
