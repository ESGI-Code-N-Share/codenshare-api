export enum UserMessageException {
  USER_NOT_FOUND = 'User not found',
  USER_CREATION_FAILED = 'User creation failed',
}

export class UserException extends Error {
  constructor(message: UserMessageException) {
    super(message)
    this.name = 'UserException'
    this.message = message
  }
}
