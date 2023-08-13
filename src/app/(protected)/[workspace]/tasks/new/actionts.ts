"use server"

import { createAction } from "~/server/api/trpc"
import { createTask } from "~/server/api/routers/task"

export const createTaskAction = createAction(createTask)
