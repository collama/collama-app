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
