export class ApiKeyNotFound extends Error {
  constructor() {
    super("API key not found")
  }
}
