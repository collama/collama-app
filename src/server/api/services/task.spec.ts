import {
  InviteStatus,
  type MembersOnTasks,
  type MembersOnTeams,
  type MembersOnWorkspaces,
  Role,
  type Task,
  type Team,
  TeamRole,
  type User,
  type Workspace,
} from "@prisma/client"
import { createMockContext, type MockContext } from "~tests/mocks/context"
import { TaskNotFound, TaskPermission } from "~/server/api/services/task"

/* eslint @typescript-eslint/unbound-method: 0 */
describe("Given a task", () => {
  let mockCtx: MockContext

  beforeEach(() => {
    mockCtx = createMockContext()
  })

  describe("When the user has been added into the task", () => {
    test("Then returns Role.Writer if user has role WRITER", async () => {
      // Mock user
      // noinspection Duplicates
      const mockUser: User = {
        id: "user-id",
        email: "test@gmail.com",
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
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        private: false,
      }

      // Mock task
      const mockTask: Task = {
        id: "task-id",
        name: "test",
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
      mockCtx.prisma.task.findUnique.mockResolvedValue(mockTask)

      // Mock members on tasks
      const mockMemberOnTask: MembersOnTasks = {
        id: "member-on-task-id",
        userId: mockUser.id,
        taskId: mockTask.id,
        workspaceId: mockWorkspace.id,
        role: Role.Writer,
        teamId: null,
        status: InviteStatus.Pending,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      // noinspection Duplicates
      mockCtx.prisma.membersOnTasks.findFirst.mockResolvedValue(
        mockMemberOnTask
      )

      const taskP = new TaskPermission(mockCtx.prisma, mockTask.id)
      const hasPermission = await taskP.checkFor(mockUser.id, Role.Writer)

      expect(mockCtx.prisma.task.findUnique).toBeCalledTimes(1)
      expect(mockCtx.prisma.user.findUnique).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTasks.findFirst).toBeCalledTimes(1)
      expect(mockCtx.prisma.membersOnTasks.findMany).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTeams.findFirst).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnWorkspaces.findFirst).toBeCalledTimes(0)
      expect(hasPermission).toBe(Role.Writer)
    })

    test("Then returns Role.Owner if user has role OWNER", async () => {
      // Mock user
      // noinspection Duplicates
      const mockUser: User = {
        id: "user-id",
        email: "test@gmail.com",
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
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        private: false,
      }

      // Mock task
      const mockTask: Task = {
        id: "task-id",
        name: "test",
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
      mockCtx.prisma.task.findUnique.mockResolvedValue(mockTask)

      // Mock members on tasks
      const mockMemberOnTask: MembersOnTasks = {
        id: "member-on-task-id",
        userId: mockUser.id,
        taskId: mockTask.id,
        workspaceId: mockWorkspace.id,
        role: Role.Owner,
        teamId: null,
        status: InviteStatus.Pending,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      // noinspection Duplicates
      mockCtx.prisma.membersOnTasks.findFirst.mockResolvedValue(
        mockMemberOnTask
      )

      const taskP = new TaskPermission(mockCtx.prisma, mockTask.id)
      const hasPermission = await taskP.checkFor(mockUser.id, Role.Owner)

      expect(mockCtx.prisma.task.findUnique).toBeCalledTimes(1)
      expect(mockCtx.prisma.user.findUnique).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTasks.findFirst).toBeCalledTimes(1)
      expect(mockCtx.prisma.membersOnTasks.findMany).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTeams.findFirst).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnWorkspaces.findFirst).toBeCalledTimes(0)
      expect(hasPermission).toBe(Role.Owner)
    })

    test("Then throws an error if the task not found", async () => {
      // Mock user
      const mockUser: User = {
        id: "user-id",
        email: "test@gmail.com",
        phone: null,
        avatar: null,
        username: "test",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockCtx.prisma.user.findUnique.mockResolvedValue(mockUser)

      const taskP = new TaskPermission(mockCtx.prisma, "invalid-task-id")
      const hasPermissionPromise = taskP.checkFor(mockUser.id, Role.Owner)

      expect(mockCtx.prisma.task.findUnique).toBeCalledTimes(1)
      expect(mockCtx.prisma.user.findUnique).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTasks.findFirst).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTasks.findMany).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTeams.findFirst).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnWorkspaces.findFirst).toBeCalledTimes(0)
      await expect(hasPermissionPromise).rejects.toThrow(TaskNotFound)
    })

    test("Then return Role.Public if the task is PUBLIC", async () => {
      // Mock user
      const mockUser: User = {
        id: "user-id",
        email: "test@gmail.com",
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
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        private: false,
      }

      // Mock task
      const mockTask: Task = {
        id: "task-id",
        name: "test",
        workspaceId: mockWorkspace.id,
        ownerId: mockUser.id,
        description: null,
        document: null,
        prompt: null,
        templateId: null,
        private: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockCtx.prisma.task.findUnique.mockResolvedValue(mockTask)

      // No need to mock membersOnTasks since the task has been already public

      const taskP = new TaskPermission(mockCtx.prisma, mockTask.id)
      const hasPermission = await taskP.checkFor(mockUser.id, Role.Owner)

      expect(mockCtx.prisma.task.findUnique).toBeCalledTimes(1)
      expect(mockCtx.prisma.user.findUnique).toBeCalledTimes(1)
      expect(mockCtx.prisma.membersOnTasks.findFirst).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTasks.findMany).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTeams.findFirst).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnWorkspaces.findFirst).toBeCalledTimes(0)
      expect(hasPermission).toBe(Role.Public)
    })
  })

  describe("When the user has been added into the team and its belong to a task", () => {
    test("Then return Role.Writer", async () => {
      // Mock user
      // noinspection Duplicates
      const mockUser: User = {
        id: "user-id",
        email: "test@gmail.com",
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
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        private: false,
      }

      // Mock task
      const mockTask: Task = {
        id: "task-id",
        name: "test",
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
      mockCtx.prisma.task.findUnique.mockResolvedValue(mockTask)

      // Mock teams on workspaces
      const mockTeamA: Team = {
        id: "mock-team-a",
        description: "",
        name: "team-a",
        ownerId: "some-owner-id",
        workspaceId: mockWorkspace.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const mockTeamB: Team = {
        id: "mock-team-b",
        description: "",
        name: "team-b",
        ownerId: "some-owner-id",
        workspaceId: mockWorkspace.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const mockMemberOnTaskA: MembersOnTasks = {
        id: "member-on-task-a-id",
        teamId: mockTeamA.id,
        taskId: mockTask.id,
        userId: null,
        workspaceId: mockWorkspace.id,
        role: Role.Owner,
        status: InviteStatus.Pending,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const mockMemberOnTaskB: MembersOnTasks = {
        id: "member-on-task-b-id",
        teamId: mockTeamB.id,
        taskId: mockTask.id,
        userId: null,
        workspaceId: mockWorkspace.id,
        role: Role.Owner,
        status: InviteStatus.Pending,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockCtx.prisma.membersOnTasks.findMany.mockResolvedValue([
        mockMemberOnTaskA,
        mockMemberOnTaskB,
      ])

      // Mock members on teams
      const mockMemberOnTeamB: MembersOnTeams = {
        id: "mock-member-on-team-id",
        role: TeamRole.Admin,
        status: InviteStatus.Accepted,
        teamId: mockTeamB.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: mockUser.id,
        workspaceId: mockWorkspace.id,
      }
      mockCtx.prisma.membersOnTeams.findFirst.mockResolvedValue(
        mockMemberOnTeamB
      )

      // noinspection Duplicates
      const taskP = new TaskPermission(mockCtx.prisma, mockTask.id)
      const hasPermission = await taskP.checkFor(mockUser.id, Role.Writer)

      expect(mockCtx.prisma.task.findUnique).toBeCalledTimes(1)
      expect(mockCtx.prisma.user.findUnique).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTasks.findFirst).toBeCalledTimes(1)
      expect(mockCtx.prisma.membersOnTasks.findMany).toBeCalledTimes(1)
      expect(mockCtx.prisma.membersOnTeams.findFirst).toBeCalledTimes(1)
      expect(mockCtx.prisma.membersOnWorkspaces.findFirst).toBeCalledTimes(0)
      expect(hasPermission).toBe(Role.Writer)
    })
  })

  describe("When the user has been added into the workspace", () => {
    test("Then return Role.Writer", async () => {
      // Mock user
      // noinspection Duplicates
      const mockUser: User = {
        id: "user-id",
        email: "test@gmail.com",
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
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        private: false,
      }

      // Mock task
      const mockTask: Task = {
        id: "task-id",
        name: "test",
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
      mockCtx.prisma.task.findUnique.mockResolvedValue(mockTask)

      // Mock teams on workspaces
      mockCtx.prisma.membersOnTasks.findMany.mockResolvedValue([])

      // Mock members on workspaces
      const mockMemberOnWorkspace: MembersOnWorkspaces = {
        id: "user-on-workspace-id",
        role: Role.Writer,
        status: InviteStatus.Accepted,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: mockUser.id,
        workspaceId: mockWorkspace.id,
        teamId: null,
      }
      mockCtx.prisma.membersOnWorkspaces.findFirst.mockResolvedValue(
        mockMemberOnWorkspace
      )

      // noinspection Duplicates
      const taskP = new TaskPermission(mockCtx.prisma, mockTask.id)
      const hasPermission = await taskP.checkFor(mockUser.id, Role.Owner)

      expect(mockCtx.prisma.task.findUnique).toBeCalledTimes(1)
      expect(mockCtx.prisma.user.findUnique).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTasks.findFirst).toBeCalledTimes(1)
      expect(mockCtx.prisma.membersOnTasks.findMany).toBeCalledTimes(1)
      expect(mockCtx.prisma.membersOnTeams.findFirst).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnWorkspaces.findFirst).toBeCalledTimes(1)
      expect(hasPermission).toBe(Role.Writer)
    })
  })

  describe("When the user does not belong to any team or workspace", () => {
    test("Then return null", async () => {
      // Mock user
      // noinspection Duplicates
      const mockUser: User = {
        id: "user-id",
        email: "test@gmail.com",
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
        ownerId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        private: false,
      }

      // Mock task
      const mockTask: Task = {
        id: "task-id",
        name: "test",
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
      mockCtx.prisma.task.findUnique.mockResolvedValue(mockTask)

      // Mock teams on workspaces
      mockCtx.prisma.membersOnTasks.findMany.mockResolvedValue([])

      // Mock members on workspaces
      mockCtx.prisma.membersOnWorkspaces.findFirst.mockResolvedValue(null)

      // noinspection Duplicates
      const taskP = new TaskPermission(mockCtx.prisma, mockTask.id)
      const hasPermission = await taskP.checkFor(mockUser.id, Role.Owner)

      expect(mockCtx.prisma.task.findUnique).toBeCalledTimes(1)
      expect(mockCtx.prisma.user.findUnique).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnTasks.findFirst).toBeCalledTimes(1)
      expect(mockCtx.prisma.membersOnTasks.findMany).toBeCalledTimes(1)
      expect(mockCtx.prisma.membersOnTeams.findFirst).toBeCalledTimes(0)
      expect(mockCtx.prisma.membersOnWorkspaces.findFirst).toBeCalledTimes(1)
      expect(hasPermission).toBe(null)
    })
  })
})
