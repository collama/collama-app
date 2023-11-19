import * as taskRevisionService from "./taskRevision.service"
import {
  canAccessTaskRevisionMiddleware,
  TaskRevisionSlugAndVersionInput,
} from "~/server/api/middlewares/permission/task-revision-permission"
import { RoleProtectedReaders } from "~/server/api/providers/permission/role"
import {
  AppendMessageInput,
  ExecuteInput,
  InsertMessageInput,
  RemoveMessageInput,
  UpdateMessageInput,
} from "~/server/api/routers/taskRevision/taskRevision.input"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

const getByIdAndVersion = protectedProcedure
  .input(TaskRevisionSlugAndVersionInput)
  .meta({
    allowedRoles: RoleProtectedReaders,
  })
  .use(canAccessTaskRevisionMiddleware)
  .input(TaskRevisionSlugAndVersionInput)
  .query(({ input, ctx }) => {
    return taskRevisionService.getByIdAndVersion({
      ...ctx,
      input,
    })
  })

export const taskRevisionTRPCRouter = createTRPCRouter({
  getByIdAndVersion,
})

export const updateMessage = protectedProcedure
  .input(TaskRevisionSlugAndVersionInput)
  .meta({
    allowedRoles: RoleProtectedReaders,
  })
  .use(canAccessTaskRevisionMiddleware)
  .input(UpdateMessageInput)
  .mutation(({ input, ctx }) => {
    return taskRevisionService.updateMessage({
      ...ctx,
      input,
    })
  })

export const appendMessage = protectedProcedure
  .input(TaskRevisionSlugAndVersionInput)
  .meta({
    allowedRoles: RoleProtectedReaders,
  })
  .use(canAccessTaskRevisionMiddleware)
  .input(AppendMessageInput)
  .mutation(({ input, ctx }) => {
    return taskRevisionService.appendMessage({
      ...ctx,
      input,
    })
  })

export const insertMessage = protectedProcedure
  .input(TaskRevisionSlugAndVersionInput)
  .meta({
    allowedRoles: RoleProtectedReaders,
  })
  .use(canAccessTaskRevisionMiddleware)
  .input(InsertMessageInput)
  .mutation(({ input, ctx }) => {
    return taskRevisionService.insertMessage({
      ...ctx,
      input,
    })
  })

export const removeMessage = protectedProcedure
  .input(TaskRevisionSlugAndVersionInput)
  .meta({
    allowedRoles: RoleProtectedReaders,
  })
  .use(canAccessTaskRevisionMiddleware)
  .input(RemoveMessageInput)
  .mutation(({ input, ctx }) => {
    return taskRevisionService.removeMessage({
      ...ctx,
      input,
    })
  })

export const executeTaskRevision = protectedProcedure
  .input(TaskRevisionSlugAndVersionInput)
  .meta({
    allowedRoles: RoleProtectedReaders,
  })
  .use(canAccessTaskRevisionMiddleware)
  .input(ExecuteInput)
  .mutation(({ input, ctx }) => {
    return taskRevisionService.executeMessage({
      ...ctx,
      input,
    })
  })
