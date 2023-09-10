"use server"

import { createAction } from "~/server/api/trpc"
import {
  createTask,
  deleteTask,
  executeTask,
  inviteMemberToTask,
} from "~/server/api/routers/task"

export const createTaskAction = createAction(createTask)

export const executeTaskAction = createAction(executeTask)

export const inviteMemberToTaskAction = createAction(inviteMemberToTask)
export const deleteTaskAction = createAction(deleteTask)
