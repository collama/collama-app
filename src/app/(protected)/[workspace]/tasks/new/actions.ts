"use server"

import * as taskRouter from "~/server/api/routers/task/task.router"
import { createAction } from "~/server/api/trpc"

export const createTaskAction = createAction(taskRouter.create)

export const executeTaskAction = createAction(taskRouter.execute)
