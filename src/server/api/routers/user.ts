import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { passage } from "~/common/passage"
import { UserNotFound } from "~/common/errors"

export const createUserIfNotExists = protectedProcedure
  .input(
    z.object({
      passageId: z.string().nonempty(),
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

      if (!user) {
        throw UserNotFound
      }

      await passage.user.update(input.passageId, {
        user_metadata: {
          user_id: user.id,
          role: "admin",
        },
      })

      if (user) {
        return user
      }
    }

    const user = await ctx.prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        phone: input.phone,
      },
    })

    await passage.user.update(input.passageId, {
      user_metadata: {
        user_id: user.id,
        role: "admin",
      },
    })

    return user
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
