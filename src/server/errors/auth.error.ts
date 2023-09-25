export class UserAlreadyExist extends Error {
  constructor() {
    super("User already exist")
  }
}
