import { publicProcedure } from "~/server/api/trpc"
import * as authService from "~/server/api/routers/auth/auth.service"
import { SignUpInput } from "~/server/api/routers/auth/dto/signUpInput"

export const authSignUp = publicProcedure
  .input(SignUpInput)
  .mutation(async ({ input, ctx }) =>
    authService.signUp({
      input,
      prisma: ctx.prisma,
    })
  )
