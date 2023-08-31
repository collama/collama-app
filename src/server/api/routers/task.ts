import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { zId } from "~/common/validation"
import { transformFilter, transformSort } from "~/services/prisma"
import { type FilterValue, type SortValue } from "~/common/types/props"
import {
  callOpenAI,
  fillVariables,
  getContent,
  getPromptFromTask,
  getTextFromTextContent,
  getVariableContents,
} from "~/server/api/services/getPrompFromTask"
import { InviteStatus, Role } from "@prisma/client"
import { isEmail } from "~/common/utils"
import { inviteTeamToTask, inviteUserToTask } from "~/server/api/services/task"
import { FailedToCreateTask, WorkspaceNotFound } from "~/common/errors"

export const createTask = protectedProcedure
  .input(
    z.object({
      name: zId,
      prompt: z.string().optional(),
      workspaceName: zId,
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.$transaction(async () => {
      const workspace = await ctx.prisma.workspace.findUnique({
        where: {
          name: input.workspaceName,
        },
      })

      if (!workspace) {
        throw WorkspaceNotFound
      }

      const task = await ctx.prisma.task.create({
        data: {
          name: input.name,
          prompt: input.prompt,
          ownerId: ctx.session.right.user.userId,
          workspaceId: workspace.id,
        },
      })

      if (!task) {
        throw FailedToCreateTask
      }

      await ctx.prisma.membersOnTasks.create({
        data: {
          userId: ctx.session.right.userId,
          workspaceId: workspace.id,
          taskId: task.id,
          role: Role.Owner,
          status: InviteStatus.Accepted,
        },
      })

      return task
    })
  })

export const taskRouter = createTRPCRouter({
  getByName: protectedProcedure
    .input(
      z.object({
        name: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: {
          name: input.name,
          ownerId: ctx.session.right.user.userId,
        },
        include: { owner: true },
      })
    }),
  getAll: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        ownerId: ctx.session.right.user.userId,
      },
    })
  }),
  getFilter: protectedProcedure
    .input(
      z.object({
        filter: z
          .object({
            list: z
              .array(
                z.object({
                  columns: z.string().nonempty(),
                  condition: z.string().nonempty(),
                  value: z.string(),
                })
              )
              .nullable(),
            operator: z.string().nonempty(),
          })
          .required(),
        sort: z
          .object({
            list: z
              .array(
                z.object({
                  columns: z.string().nonempty(),
                  condition: z.string().nonempty(),
                })
              )
              .nullable(),
          })
          .required(),
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const filters = transformFilter(input.filter as FilterValue)
      const sorts = transformSort(input.sort as SortValue)

      return ctx.prisma.task.findMany({
        where: {
          ...filters,
          workspace: {
            name: input.name,
          },
        },
        orderBy: sorts,
        include: { owner: true },
      })
    }),
  getPromptVariables: protectedProcedure
    .input(
      z.object({
        name: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      const prompt = await getPromptFromTask(ctx.prisma, input.name)

      return getVariableContents(prompt.content)
    }),
})

export const executeTask = protectedProcedure
  .input(
    z.object({
      name: zId,
      variables: z.record(z.string()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const prompt = await getPromptFromTask(ctx.prisma, input.name)

    const contents = getContent(prompt.content)
    const textContent = fillVariables(contents, input.variables)
    const text = getTextFromTextContent(textContent)

    // TODO:The response can returns an array, we need to check it later
    const choices = await callOpenAI(text)

    return choices[0]?.message.content
  })

export const inviteMemberToTask = protectedProcedure
  .input(
    z.object({
      workspaceName: z.string(),
      taskName: z.string(),
      emailOrTeamName: z.string().email().or(z.string()),
      role: z.nativeEnum(Role),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { emailOrTeamName, ...inviteInput } = input
    return isEmail(input.emailOrTeamName)
      ? inviteUserToTask(ctx.prisma, { ...inviteInput, email: emailOrTeamName })
      : inviteTeamToTask(ctx.prisma, { ...inviteInput, teamName: emailOrTeamName })
  })
