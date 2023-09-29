export class WorkspaceNotFound extends Error {
  constructor() {
    super("Workspace not found")
  }
}

export class WorkspaceMemberNotFound extends Error {
  constructor() {
    super("Workspace member not found")
  }
}

export class LastOwnerCanNotRemoved extends Error {
  constructor() {
    super("Can not remove last owner from workspace")
  }
}
