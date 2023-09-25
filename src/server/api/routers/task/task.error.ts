export class TaskNotFound extends Error {
  constructor() {
    super("task not found")
  }
}

// Create a class that throw the error: You do not have permission to invite members to this task
export class NoPermissionToInviteMembers extends Error {
  constructor() {
    super("You do not have permission to invite members to this task")
  }
}
