import * as taskService from "~/server/api/routers/task/task.service"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import {
  CreateTaskInput,
  ExecuteTaskInput,
  GetTaskBySlugInput,
  InviteMemberInput,
} from "~/server/api/routers/task/dto/task.input"
import { FilterAndSortInput } from "~/server/api/routers/task/dto/task-filter.input"
import {
  canAccessTaskMiddleware,
  TaskIdInput,
} from "~/server/api/middlewares/permission/task-permission"
import {
  TaskProtectedReaders,
  TaskProtectedWriters,
} from "~/server/api/providers/permission/role"

export const create = protectedProcedure
  .input(CreateTaskInput)
  .mutation(({ ctx, input }) => {
    return taskService.create(input, ctx.session)
  })

export const execute = protectedProcedure
  .input(TaskIdInput)
  .meta({
    allowedRoles: TaskProtectedWriters,
  })
  .use(canAccessTaskMiddleware)
  .input(ExecuteTaskInput)
  .mutation(({ input, ctx }) => {
    return taskService.execute({
      ...ctx,
      input,
    })
  })

export const deleteBySlug = protectedProcedure
  .input(TaskIdInput)
  .meta({
    allowedRoles: TaskProtectedWriters,
  })
  .use(canAccessTaskMiddleware)
  .mutation(({ input, ctx }) => {
    return taskService.deleteById({
      ...ctx,
      input,
    })
  })

export const inviteMember = protectedProcedure
  .input(TaskIdInput)
  .meta({
    allowedRoles: TaskProtectedWriters,
  })
  .use(canAccessTaskMiddleware)
  .input(InviteMemberInput)
  .mutation(({ input, ctx }) => {
    return taskService.inviteMember({
      ...ctx,
      input,
    })
  })

export const removeMember = protectedProcedure
  .input(TaskIdInput)
  .meta({
    allowedRoles: TaskProtectedWriters,
  })
  .use(canAccessTaskMiddleware)
  .mutation(({ input, ctx }) => {
    return taskService.removeMember({
      ...ctx,
      input,
    })
  })

const getBySlug = protectedProcedure
  .input(GetTaskBySlugInput)
  .meta({
    allowedRoles: TaskProtectedReaders,
  })
  .use(canAccessTaskMiddleware)
  .input(GetTaskBySlugInput)
  .query(({ input, ctx }) => {
    return taskService.getBySlug({
      ...ctx,
      input,
    })
  })

const getPromptVariables = protectedProcedure
  .input(TaskIdInput)
  .meta({
    allowedRoles: TaskProtectedWriters,
  })
  .use(canAccessTaskMiddleware)
  .input(TaskIdInput)
  .query(({ input, ctx }) => {
    return taskService.getPromptVariables({
      ...ctx,
      input,
    })
  })

const getMembers = protectedProcedure
  .input(TaskIdInput)
  .meta({
    allowedRoles: TaskProtectedReaders,
  })
  .use(canAccessTaskMiddleware)
  .input(TaskIdInput)
  .query(({ input, ctx }) => {
    return taskService.getMembers({
      ...ctx,
      input,
    })
  })

const filterAndSort = protectedProcedure
  .input(FilterAndSortInput)
  .query(({ input, ctx }) => {
    return taskService.filterAndSort({
      ...ctx,
      input,
    })
  })

export const taskTRPCRouter = createTRPCRouter({
  getBySlug,
  getMembers,
  getPromptVariables,
  filterAndSort,
})
