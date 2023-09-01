import { InviteStatus, Prisma, type Role as PrismaRole } from "@prisma/client"
import { isEmail } from "~/common/utils"
import { WorkspaceNotFound } from "~/common/errors"
import MembersOnTasksCreateArgs = Prisma.MembersOnTasksCreateArgs

interface InviteMemberData {
  emailOrTeamName: string
  taskName: string
  workspaceName: string
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
              name: data.workspaceName,
            },
          })

          if (!workspace) throw WorkspaceNotFound

          const insertData: MembersOnTasksCreateArgs["data"] = {
            task: {
              connect: {
                name: data.taskName,
              },
            },
            workspace: {
              connect: {
                name: data.workspaceName,
              },
            },
            role: data.role,
            status: InviteStatus.Accepted,
          }

          if (!isEmail(data.emailOrTeamName)) {
            insertData.team = {
              connect: {
                team_identifier: {
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
