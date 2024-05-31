export enum FriendMessageException {
  FRIEND_NOT_FOUND = 'User not found',
  FRIEND_ALREADY_EXISTS = 'Friend already exists',
}

export class FriendException extends Error {
  constructor(message: FriendMessageException) {
    super(message)
    this.name = 'FriendException'
    this.message = message
  }
}
