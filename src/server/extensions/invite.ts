import { InviteStatus, Prisma, type Role as PrismaRole } from "@prisma/client"
import { isEmail } from "~/common/utils"
import { WorkspaceNotFound } from "~/server/errors/workspace.error"

import MembersOnTasksCreateArgs = Prisma.MembersOnTasksCreateArgs

interface InviteMemberData {
  emailOrTeamName: string
  taskId: string
  workspaceId: string
  role: PrismaRole
}

// export type InviteMemberData = _InviteMemberData["email"] extends undefined
//   ? Omit<_InviteMemberData, "email">
//   : Omit<_InviteMemberData, "teamName">

export const inviteUserToTaskExtension = Prisma.defineExtension((prisma) => {
  return prisma.$extends({
    model: {
      membersOnTasks: {
        async inviteMember<T>(this: T, data: InviteMemberData) {
          const workspace = await prisma.workspace.findFirst({
            where: {
              id: data.workspaceId,
            },
          })

          if (!workspace) throw new WorkspaceNotFound()

          const insertData: MembersOnTasksCreateArgs["data"] = {
            task: {
              connect: {
                id: data.taskId,
              },
            },
            workspace: {
              connect: {
                id: data.workspaceId,
              },
            },
            role: data.role,
            status: InviteStatus.Accepted,
          }

          if (!isEmail(data.emailOrTeamName)) {
            insertData.team = {
              connect: {
                name_workspaceId: {
                  name: data.emailOrTeamName,
                  workspaceId: workspace.id,
                },
              },
            }
          } else {
            insertData.user = {
              connect: {
                email: data.emailOrTeamName,
              },
            }
          }

          return prisma.membersOnTasks.create({
            data: insertData,
          })
        },
      },
    },
  })
})
