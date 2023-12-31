export class TaskNotFound extends Error {
  constructor() {
    super("Task not found")
  }
}

export class MemberNotFound extends Error {
  constructor() {
    super("Member not found")
  }
}

export class CannotRemoveOwner extends Error {
  constructor() {
    super("You cannot remove owner")
  }
}
