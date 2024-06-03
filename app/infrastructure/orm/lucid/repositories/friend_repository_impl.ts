import { FriendRepositoryPort } from '#domains/friends/friend_repository'
import { Friend, type FriendId } from '#domains/friends/friend_model'
import { User } from '#domains/users/user_model'
import FriendEntity from '#infrastructure/orm/lucid/entities/friend_entity'

export class FriendRepositoryImpl implements FriendRepositoryPort {
  constructor() {}

  async isFollowing(follower: User, followed: User): Promise<boolean> {
    const friend = await FriendEntity.query()
      .where('requestedBy', follower.userId)
      .where('addressedTo', followed.userId)
      .first()
    return !!friend
  }

  async create(friend: Friend): Promise<Friend> {
    const newFriend = await FriendEntity.create({
      friendId: friend.friendId,
      requestedBy: friend.requestedBy.userId,
      addressedTo: friend.addressedTo.userId,
    })
    const savedFriend = await FriendEntity.query()
      .where('friendId', newFriend.friendId)
      .preload('sender')
      .preload('receiver')
      .firstOrFail()
    return savedFriend.toDomain()
  }

  async delete(follower: User, followed: User): Promise<FriendId> {
    const friend = await FriendEntity.query()
      .where('requestedBy', follower.userId)
      .where('addressedTo', followed.userId)
      .firstOrFail()
    await friend.delete()
    return friend.friendId
  }
}
