import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { zId } from "~/common/validation"

export const createTask = protectedProcedure
  .input(
    z.object({
      name: zId,
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
  getAll: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        owner: {
          email: ctx.session.right.email,
        },
      },
    })
  }),
  getFilter: protectedProcedure
    .input(
      z.object({
        filter: z
          .array(
            z.object({
              columns: z.string().nonempty(),
              condition: z.string().nonempty(),
              value: z.string(),
            })
          )
          .nullable(),
      })
    )
    .query(async ({ ctx, input }) => {
      const filters = input.filter?.reduce((previousValue, currentValue) => {
        previousValue[currentValue.columns] = {
          [currentValue.condition]: currentValue.value,
        }
        return previousValue
      }, {} as Record<string, Record<string, string>>)

      return ctx.prisma.task.findMany({
        where: filters,
        include: { owner: true },
      })
    }),
})
