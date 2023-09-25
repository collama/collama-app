import { createMockContext, type MockContext } from "~tests/mocks/context"
import {
  InviteStatus,
  Role,
  type MembersOnTasks,
  type PrismaClient,
  type Task,
  type User,
  type Workspace,
} from "@prisma/client"
import { canUserAccess } from "~/server/extensions/task-permission"
import { RoleAdmin, RoleOwner } from "~/server/api/services/types"

describe("TaskPermission", () => {
  let mockCtx: MockContext

  beforeEach(() => {
    mockCtx = createMockContext()
  })

  it("should user can access", async () => {
    // Mock user
    // noinspection Duplicates
    const mockUser: User = {
      id: "user-id",
      email: "test@gmail.com",
      emailVerified: new Date(),
      password: "",
      phone: null,
      avatar: null,
      username: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockCtx.prisma.user.findUnique.mockResolvedValue(mockUser)

    const mockWorkspace: Workspace = {
      id: "workspace-id",
      name: "test",
      slug: "test",
      ownerId: mockUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      private: false,
    }

    const mockTask: Task = {
      id: "task-id",
      name: "test",
      slug: "test",
      workspaceId: mockWorkspace.id,
      ownerId: mockUser.id,
      description: null,
      document: null,
      prompt: null,
      templateId: null,
      private: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockCtx.prisma.task.findUnique.mockResolvedValueOnce(mockTask)

    // Mock member on task
    const mockMemberOnTask: MembersOnTasks = {
      id: "member-on-task-id",
      userId: mockUser.id,
      taskId: mockTask.id,
      workspaceId: mockWorkspace.id,
      role: Role.Admin,
      teamId: null,
      status: InviteStatus.Pending,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    // noinspection Duplicates
    mockCtx.prisma.membersOnTasks.findMany.mockResolvedValueOnce([
      mockMemberOnTask,
    ])

    const canAccess = await canUserAccess(
      mockCtx.prisma as unknown as PrismaClient,
      {
        userId: mockUser.id,
        slug: mockTask.slug,
        allowedRoles: [RoleOwner, RoleAdmin],
      }
    )

    expect(canAccess).toEqual(true)
  })

  it("should user can not access", async () => {
    // Mock user
    // noinspection Duplicates
    const mockUser: User = {
      id: "user-id",
      email: "test@gmail.com",
      emailVerified: new Date(),
      password: "",
      phone: null,
      avatar: null,
      username: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockCtx.prisma.user.findUnique.mockResolvedValue(mockUser)

    const mockWorkspace: Workspace = {
      id: "workspace-id",
      name: "test",
      slug: "test",
      ownerId: mockUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      private: false,
    }

    const mockTask: Task = {
      id: "task-id",
      name: "test",
      slug: "test",
      workspaceId: mockWorkspace.id,
      ownerId: mockUser.id,
      description: null,
      document: null,
      prompt: null,
      templateId: null,
      private: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockCtx.prisma.task.findUnique.mockResolvedValueOnce(mockTask)

    // Mock member on task
    const mockMemberOnTask: MembersOnTasks = {
      id: "member-on-task-id",
      userId: mockUser.id,
      taskId: mockTask.id,
      workspaceId: mockWorkspace.id,
      role: Role.Reader,
      teamId: null,
      status: InviteStatus.Pending,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    // noinspection Duplicates
    mockCtx.prisma.membersOnTasks.findMany.mockResolvedValueOnce([
      mockMemberOnTask,
    ])

    const canAccess = await canUserAccess(
      mockCtx.prisma as unknown as PrismaClient,
      {
        userId: mockUser.id,
        slug: mockTask.slug,
        allowedRoles: [RoleOwner, RoleAdmin],
      }
    )

    expect(canAccess).toEqual(false)
  })
})
