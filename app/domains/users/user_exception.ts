export enum UserMessageException {
  USER_NOT_FOUND = 'User not found',
}

export class UserException extends Error {
  constructor(message: UserMessageException) {
    super(message)
    this.name = 'UserException'
    this.message = message
  }
}
