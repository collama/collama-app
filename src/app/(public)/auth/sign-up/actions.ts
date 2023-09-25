"use server"

import { createAction } from "~/server/api/trpc"
import { authSignUp } from "~/server/api/routers/auth/auth.router"

export const signUpAction = createAction(authSignUp)
