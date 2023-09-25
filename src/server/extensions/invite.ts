import { InviteStatus, Prisma, type Role as PrismaRole } from "@prisma/client"
import { isEmail } from "~/common/utils"
import { WorkspaceNotFound } from "~/common/errors"
import MembersOnTasksCreateArgs = Prisma.MembersOnTasksCreateArgs

interface InviteMemberData {
  emailOrTeamName: string
  taskSlug: string
  workspaceSlug: string
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
              slug: data.workspaceSlug,
            },
          })

          if (!workspace) throw WorkspaceNotFound

          const insertData: MembersOnTasksCreateArgs["data"] = {
            task: {
              connect: {
                slug: data.taskSlug,
              },
            },
            workspace: {
              connect: {
                name: data.workspaceSlug,
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
