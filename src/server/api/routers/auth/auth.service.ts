import type { z } from "zod"
import { type SignUpInput } from "~/server/api/routers/auth/dto/signUpInput"
import { type ExtendedPrismaClient } from "~/server/db"
import crypto from "crypto"
import { createWorkspace } from "~/server/api/routers/workspace/workspace.service"
import { UserAlreadyExist } from "~/server/errors/auth.error"

interface AuthProcedureInput<T = unknown> {
  prisma: ExtendedPrismaClient
  input: T
}

export const signUp = async ({
  input,
  prisma,
}: AuthProcedureInput<z.infer<typeof SignUpInput>>) => {
  const user = await prisma.user.findFirst({
    where: {
      email: input.email,
    },
  })

  if (user) {
    throw new UserAlreadyExist()
  }

  const salt = crypto.randomBytes(16).toString("hex")
  const hashPassword = crypto
    .pbkdf2Sync(input.password, salt, 1000, 64, "sha512")
    .toString(`hex`)

  const createdUser = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username.toLowerCase(),
      password: hashPassword,
      salt,
    },
  })

  await createWorkspace({
    input: {
      name: input.username,
    },
    session: {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.username,
      },
      expires: new Date().toISOString(),
    },
    prisma,
  })

  return createdUser
}
