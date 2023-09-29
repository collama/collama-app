"use server"

import { authSignUp } from "~/server/api/routers/auth/auth.router"
import { createAction } from "~/server/api/trpc"

export const signUpAction = createAction(authSignUp)
