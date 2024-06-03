import { User } from '#domains/users/user_model'
import { randomUUID } from 'node:crypto'

export type FriendId = string

export class Friend {
  friendId: FriendId
  requestedBy: User
  addressedTo: User
  createdAt: Date

  private constructor(friendId: FriendId, requestedBy: User, addressedTo: User, createdAt: Date) {
    this.friendId = friendId
    this.requestedBy = requestedBy
    this.addressedTo = addressedTo
    this.createdAt = createdAt
  }

  static new(requestedBy: User, addressedTo: User): Friend {
    return new Friend(randomUUID(), requestedBy, addressedTo, new Date())
  }

  static fromPersistence(data: {
    friendId: FriendId
    requestedBy: User
    addressedTo: User
    createdAt: Date
  }): Friend {
    return new Friend(data.friendId, data.requestedBy, data.addressedTo, data.createdAt)
  }
}
