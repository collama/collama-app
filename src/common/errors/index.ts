//GET
export const TokenNotFound = new Error("token not found")
export const UserNotFound = new Error("user not found")
export const TeamNotFound = new Error("team not found")
export const WorkspaceNotFound = new Error("workspace not found")
export const Unauthorized = new Error("unauthorized")
export const ExistUser = new Error("user is exist")

// Create
export const FailedToCreateTask = new Error("failed to create task")
export const FailedToInviteMemberToTeam = new Error("failed to invite member to team")


// Delete
export const CanNotRemoveOwner = new Error("can not remove owner")
