import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { ExistUser } from "~/common/errors"
import { hash } from "bcrypt"

// TODO(linh): register user
export const createUser = protectedProcedure
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

    if (user) throw ExistUser

    const hashPassword = await hash(input.password, 10)

    return ctx.prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: hashPassword,
      },
    })
  })

export const updateUserAvatar = protectedProcedure
  .input(
    z.object({
      avatar: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.user.update({
      where: {
        email: ctx.session.right.user.email,
      },
      data: {
        avatar: input.avatar,
      },
    })
  })

export const getUser = protectedProcedure.query(async ({ ctx }) => {
  const session = ctx.session.right
  return ctx.prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })
})

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany()
  }),
  getUser,
})
