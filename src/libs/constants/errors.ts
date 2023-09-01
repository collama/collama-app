export class ExtendedError extends Error {
  constructor(message: string, cause?: string) {
    super(message, {
      cause,
    })
  }
}

export const UserNotFound = new ExtendedError("user not found")
export const SessionNotFound = new ExtendedError("session not found")
export const Unauthorized = new ExtendedError("unauthorized")
export const MemberNotFound = new ExtendedError("member not found")
export const LastOwnerCanNotRemoved = new ExtendedError(
  "can not remove last owner from workspace"
)

export const UserExisted = new ExtendedError("user has already existed")

export const TaskNotFound = new ExtendedError("task not found")
