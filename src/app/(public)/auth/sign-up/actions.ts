"use server"

import { signUp } from "~/server/api/routers/auth"
import { createAction } from "~/server/api/trpc"

export const signUpAction = createAction(signUp)
