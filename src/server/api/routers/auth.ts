import { publicProcedure } from "~/server/api/trpc"
import z from "zod"
import { hash } from "bcrypt"
import { env } from "~/env.mjs"
import { UserExisted } from "~/libs/constants/errors"

export const signUp = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
      username: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        email: input.email,
      },
    })

    if (user) {
      throw UserExisted
    }

    const hashPassword = await hash(input.password, env.SALT_ROUND)

    return ctx.prisma.user.create({
      data: {
        email: input.email,
        username: input.username.toLowerCase(),
        password: hashPassword,
      },
    })
  })
