import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { passage } from "~/common/passage"
import { GetResult } from "@prisma/client/runtime/library"

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
    console.log("ctx.session.right.email", ctx.session.right.email)

    let user
    if (ctx.session.right.email) {
      user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })
    }

    if (user) {
      return user
    }

    user = await ctx.prisma.user.upsert({
      where: {
        username: input.username,
        email: input.email,
      },
      create: {
        username: input.username,
        email: input.email,
        phone: input.phone,
      },
      update: {
        email: input.email,
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
