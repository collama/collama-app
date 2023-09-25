import * as taskService from "~/server/api/routers/task/task.service"
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
  .mutation( ({ ctx, input }) => {
    return taskService.create(input, ctx.session)
  })

export const execute = protectedProcedure
  .input(ExecuteTaskInput)
  .mutation( ({ input }) => {
    return taskService.execute(input)
  })

export const deleteById = protectedProcedure
  .input(DeleteTaskInput)
  .mutation( ({ input }) => {
    return taskService.deleteById(input)
  })

export const inviteMember = protectedProcedure
  .input(InviteMemberInput)
  .mutation( ({ input }) => {
    return taskService.inviteMember(input)
  })

export const removeMember = protectedProcedure
  .input(RemoveMemberInput)
  .mutation( ({ input }) => {
    return taskService.removeMember(input)
  })

const getBySlug = protectedProcedure
  .input(GetTaskBySlugInput)
  .query( ({ input, ctx }) => {
    return taskService.getBySlug(input, ctx.session)
  })

const getPromptVariables = protectedProcedure
  .input(GetTaskBySlugInput)
  .query( ({ input }) => {
    return taskService.getPromptVariables(input)
  })

const getMembers = protectedProcedure
  .input(GetMembersSlugInput)
  .query( ({ input }) => {
    return taskService.getMembers(input)
  })

const filterAndSort = protectedProcedure
  .input(FilterAndSortInput)
  .query( ({ input }) => {
    return taskService.filterAndSort(input)
  })

export const taskTRPCRouter = createTRPCRouter({
  getBySlug,
  getMembers,
  getPromptVariables,
  filterAndSort,
})
