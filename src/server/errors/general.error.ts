export class NoPermission extends Error {
  constructor() {
    super("You do not have permission to do this action")
  }
}
