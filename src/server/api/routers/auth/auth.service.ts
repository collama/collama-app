import crypto from "crypto"
import dayjs from "dayjs"
import type { z } from "zod"
import { adapter } from "~/libs/auth"
import { type SignUpInput } from "~/server/api/routers/auth/dto/signUpInput"
import { createWorkspace } from "~/server/api/routers/workspace/workspace.service"
import { type ExtendedPrismaClient } from "~/server/db"
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

  const account = await adapter.linkAccount({
    userId: createdUser.id,
    providerAccountId: createdUser.id,
    type: "email",
    provider: "credentials",
    access_token: "",
    refresh_token: "",
    scope: "",
    expires_at: 60,
    token_type: "Bearer",
    id_token: "",
    session_state: "",
  })

  console.log("account", account)

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
