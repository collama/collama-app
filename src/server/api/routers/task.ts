import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const createTask = protectedProcedure
  .input(
    z.object({
      name: z
        .string()
        .max(20)
        .min(3)
        .refine(
          (v) => /^(\w+-)*\w+$/.test(v),
          "Name should contain only alphabets and -"
        ),
      prompt: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const email = ctx.session.right.email
    return ctx.prisma.task.create({
      data: {
        name: input.name,
        prompt: input.prompt,
        owner: {
          connect: {
            email,
          },
        },
      },
    })
  })

export const taskRouter = createTRPCRouter({
  getByName: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .max(20)
          .min(3)
          .refine(
            (v) => /^(\w+-)*\w+$/.test(v),
            "Name should contain only alphabets and -"
          ),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: {
          name: input.name,
        },
      })
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        owner: {
          email: ctx.session.right.email,
        },
      },
    })
  }),
})
