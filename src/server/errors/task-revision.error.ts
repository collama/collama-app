export class TaskRevisionNotFound extends Error {
  constructor() {
    super("Version not found")
  }
}
