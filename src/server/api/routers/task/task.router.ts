import {
  canAccessTaskMiddleware,
  TaskIdInput,
  TaskSlugInput,
} from "~/server/api/middlewares/permission/task-permission"
import {
  canAccessWorkspaceMiddleware,
  WorkspaceSlugInput,
} from "~/server/api/middlewares/permission/workspace-permission"
import {
  RoleProtectedReaders,
  RoleProtectedWriters,
} from "~/server/api/providers/permission/role"
import { FilterAndSortInput } from "~/server/api/routers/task/dto/task-filter.input"
import {
  CreateTaskInput,
  ExecuteTaskInput,
  InviteMemberInput,
  RemoveTaskMemberInput,
} from "~/server/api/routers/task/dto/task.input"
import * as taskService from "~/server/api/routers/task/task.service"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const create = protectedProcedure
  .input(WorkspaceSlugInput)
  .meta({
    allowedRoles: RoleProtectedReaders,
  })
  .use(canAccessWorkspaceMiddleware)
  .input(CreateTaskInput)
  .mutation(({ ctx, input }) => {
    return taskService.create({
      ...ctx,
      input,
    })
  })

export const execute = protectedProcedure
  .input(TaskIdInput)
  .meta({
    allowedRoles: RoleProtectedWriters,
  })
  .use(canAccessTaskMiddleware)
  .input(ExecuteTaskInput)
  .mutation(({ input, ctx }) => {
    return taskService.execute({
      ...ctx,
      input,
    })
  })

export const deleteTaskById = protectedProcedure
  .input(TaskIdInput)
  .meta({
    allowedRoles: RoleProtectedWriters,
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
    allowedRoles: RoleProtectedWriters,
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
    allowedRoles: RoleProtectedWriters,
  })
  .use(canAccessTaskMiddleware)
  .input(RemoveTaskMemberInput)
  .mutation(({ input, ctx }) => {
    return taskService.removeMember({
      ...ctx,
      input,
    })
  })

const getBySlug = protectedProcedure
  .input(TaskSlugInput)
  .meta({
    allowedRoles: RoleProtectedReaders,
  })
  .use(canAccessTaskMiddleware)
  .input(TaskSlugInput)
  .query(({ input, ctx }) => {
    return taskService.getBySlug({
      ...ctx,
      input,
    })
  })

const getPromptVariables = protectedProcedure
  .input(TaskIdInput)
  .meta({
    allowedRoles: RoleProtectedWriters,
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
    allowedRoles: RoleProtectedReaders,
  })
  .use(canAccessTaskMiddleware)
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
