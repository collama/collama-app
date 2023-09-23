import * as taskService from "~/server/api/routers/task/task-service"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import {
  CreateTaskInput,
  DeleteTaskInput,
  ExecuteTaskInput,
  GetMembersSlugInput,
  GetTaskBySlugInput,
  InviteMemberInput,
  RemoveMemberInput,
} from "~/server/api/routers/task/dto/task.input"
import { FilterAndSortInput } from "~/server/api/routers/task/dto/task-filter.input"

export const create = protectedProcedure
  .input(CreateTaskInput)
  .mutation(async ({ ctx, input }) => {
    return taskService.create(input, ctx.session)
  })

export const execute = protectedProcedure
  .input(ExecuteTaskInput)
  .mutation(async ({ input }) => {
    return taskService.execute(input)
  })

export const deleteBySlug = protectedProcedure
  .input(DeleteTaskInput)
  .mutation(async ({ input }) => {
    return taskService.deleteBySlug(input)
  })

export const inviteMember = protectedProcedure
  .input(InviteMemberInput)
  .mutation(async ({ input }) => {
    return taskService.inviteMember(input)
  })

export const removeMember = protectedProcedure
  .input(RemoveMemberInput)
  .mutation(async ({ input }) => {
    return taskService.removeMember(input)
  })

export const getBySlug = protectedProcedure
  .input(GetTaskBySlugInput)
  .query(async ({ input, ctx }) => {
    return taskService.getBySlug(input, ctx.session)
  })

export const getPromptVariables = protectedProcedure
  .input(GetTaskBySlugInput)
  .query(async ({ input }) => {
    return taskService.getPromptVariables(input)
  })

export const getMembers = protectedProcedure
  .input(GetMembersSlugInput)
  .query(async ({ input }) => {
    return taskService.getMembers(input)
  })

export const filterAndSort = protectedProcedure
  .input(FilterAndSortInput)
  .query(async ({ input }) => {
    return taskService.filterAndSort(input)
  })

export const taskTRPCRouter = createTRPCRouter({
  getBySlug,
  getMembers,
  getPromptVariables,
  filterAndSort,
})
