import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import {
  CreateTeamInput,
  DeleteTeamMemberByIdInput,
  DeleteTeamByIdInput,
  GetTeamBySlugInput,
  InviteMemberToTeamInput,
  MembersOnTeamInput,
  TeamsOnWorkspaceInput,
} from "~/server/api/routers/team/dto/team.input"
import * as teamService from "~/server/api/routers/team/team.service"

export const createTeam = protectedProcedure
  .input(CreateTeamInput)
  .mutation(({ input, ctx }) => teamService.createTeam(input, ctx.session))

export const inviteMemberToTeam = protectedProcedure
  .input(InviteMemberToTeamInput)
  .mutation(({ input }) => teamService.inviteMemberToTeam(input))

export const deleteTeamById = protectedProcedure
  .input(DeleteTeamByIdInput)
  .mutation(({ input }) => teamService.deleteTeamById(input))

export const deleteTeamMemberById = protectedProcedure
  .input(DeleteTeamMemberByIdInput)
  .mutation(({ input }) => teamService.deleteTeamMemberById(input))

const teamsOnWorkspace = protectedProcedure
  .input(TeamsOnWorkspaceInput)
  .query(({ input }) => teamService.teamsOnWorkspace(input))

const membersOnTeam = protectedProcedure
  .input(MembersOnTeamInput)
  .query(({ input }) => teamService.membersOnTeam(input))

const getTeamBySlug = protectedProcedure
  .input(GetTeamBySlugInput)
  .query(({ input }) => teamService.getTeamBySlug(input))

export const teamTRPCRouter = createTRPCRouter({
  teamsOnWorkspace,
  membersOnTeam,
  getTeamBySlug,
})
