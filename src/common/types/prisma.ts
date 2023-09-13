import { type Prisma } from "@prisma/client"

export type TaskIncludeOwner = Prisma.TaskGetPayload<{
  include: { owner: true }
}>

export type MemberOnWorkspaceIncludeUserMail =
  Prisma.MembersOnWorkspacesGetPayload<{
    include: {
      user: {
        select: {
          email: true
        }
      }
    }
  }>

export type TeamIncludeOwner = Prisma.TeamGetPayload<{
  include: {
    owner: true
  }
}>

export type MembersOnTeamsIncludeUser = Prisma.MembersOnTeamsGetPayload<{
  include: {
    user: true
  }
}>

export type MembersOnTaskIncludeUserTeam = Prisma.MembersOnTasksGetPayload<{
  include: {
    user: true
    team: true
  }
}>

export type ApiKeyIncludeUser = Prisma.ApiKeyGetPayload<{
  include: {
    owner: true
  }
}>
