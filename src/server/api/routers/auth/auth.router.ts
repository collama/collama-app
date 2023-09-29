import * as authService from "~/server/api/routers/auth/auth.service"
import { SignUpInput } from "~/server/api/routers/auth/dto/signUpInput"
import { publicProcedure } from "~/server/api/trpc"

export const authSignUp = publicProcedure
  .input(SignUpInput)
  .mutation(async ({ input, ctx }) =>
    authService.signUp({
      input,
      prisma: ctx.prisma,
    })
  )
