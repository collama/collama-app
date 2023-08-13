import { AccessControl } from "role-acl"
import { createTeamReaderFactory } from "~/server/extensions/rbac/role"
import { Action, Resource } from "@prisma/client"
import { Role } from "~/server/extensions/rbac/types"

describe("Given the team/member", () => {
  describe("When checking READ permission for a team", () => {
    const createTeamMemberRole = createTeamReaderFactory("teamId1")

    it("Then I expect the ac granted to be true", async () => {
      const ac = new AccessControl([
        ...createTeamMemberRole("userId1"),
        ...createTeamMemberRole("userId2"),
      ])
      const permission = await ac
        .can(Role.TeamReader)
        .context({
          teamId: "teamId1",
          userId: "userId1",
        })
        .execute(Action.READ)
        .on(Resource.Team)
      expect(permission.granted).toBe(true)
    })

    it("Then I expect the ac granted to be false", async () => {
      const ac = new AccessControl([
        ...createTeamMemberRole("userId1"),
        ...createTeamMemberRole("userId2"),
      ])
      const permission = await ac
        .can("team/member")
        .context({
          teamId: "teamId2",
          userId: "userId1",
        })
        .execute("read")
        .on("team")
      expect(permission.granted).toBe(false)
    })
  })
})
