export class TaskNotFound extends Error {
  constructor() {
    super("Task not found")
  }
}

export class NoPermissionToInviteMembers extends Error {
  constructor() {
    super("You do not have permission to invite members to this task")
  }
}

export class MemberNotFound extends Error {
  constructor() {
    super("Member not found")
  }
}
