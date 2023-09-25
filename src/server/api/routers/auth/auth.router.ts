import { publicProcedure } from "~/server/api/trpc"
import { signUpInput } from "~/server/api/routers/auth/dto/signUpInput"
import * as authService from "~/server/api/routers/auth/auth.service"

export const authSignUp = publicProcedure
  .input(signUpInput)
  .mutation(async ({ input }) => authService.signUp(input))
