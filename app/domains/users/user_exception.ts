export enum UserMessageException {
  USER_NOT_FOUND = 'User not found',
  USER_CREATION_FAILED = 'User creation failed',
  USER_UPDATE_FAILED = 'User update failed',
  EMAIL_ALREADY_VERIFIED = 'Email already verified',
}

export class UserException extends Error {
  constructor(message: UserMessageException) {
    super(message)
    this.name = 'UserException'
    this.message = message
  }
}
