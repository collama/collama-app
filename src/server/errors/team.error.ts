export class TeamNotFound extends Error {
  constructor() {
    super("Team not found")
  }
}

export class TeamMemberNotFound extends Error {
  constructor() {
    super("Team member not found")
  }
}

export class CannotRemoveTeamOwner extends Error {
  constructor() {
    super("Can not remove team owner")
  }
}
