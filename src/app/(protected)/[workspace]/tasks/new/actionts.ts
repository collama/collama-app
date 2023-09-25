"use server"

import { createAction } from "~/server/api/trpc"
import {
  create as createTask,
  deleteBySlug as deleteTaskBySlug,
  execute as executeTask,
  inviteMember as inviteMemberOnTask,
  removeMember as removeMemberOnTask,
} from "~/server/api/routers/task/task-router"

export const createTaskAction = createAction(createTask)

export const executeTaskAction = createAction(executeTask)

export const inviteMemberOnTaskAction = createAction(inviteMemberOnTask)

export const deleteTaskBySlugAction = createAction(deleteTaskBySlug)

export const removeMemberOnTaskAction = createAction(removeMemberOnTask)
