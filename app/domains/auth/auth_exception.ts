export enum AuthMessageException {
  USER_WITH_CREDENTIALS_NOT_FOUND = 'User with credentials not found',
  USER_WITH_EMAIL_ALREADY_EXISTS = 'User with email already exists',
  REGISTRATION_FAILED = 'Registration failed',
}

export class AuthException extends Error {
  constructor(message: AuthMessageException) {
    super(message)
    this.name = 'AuthException'
    this.message = message
  }
}
