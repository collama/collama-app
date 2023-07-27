import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const createUserIfNotExists = protectedProcedure
  .input(
    z.object({
      username: z.string().max(20),
      email: z.string().email(),
      phone: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (ctx.session.right.email) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })

      if (user) {
        return user
      }
    }

    return ctx.prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        phone: input.phone,
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
        email: ctx.session.right.email,
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
      email: session.email,
    },
  })
})

export const userRouter = createTRPCRouter({
  createIfNotExists: createUserIfNotExists,
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany()
  }),
  getUser,
})
