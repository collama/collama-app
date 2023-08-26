"use server"

import { createAction } from "~/server/api/trpc"
import { createTask, executeTask } from "~/server/api/routers/task"

export const createTaskAction = createAction(createTask)

export const executeTaskAction = createAction(executeTask)
