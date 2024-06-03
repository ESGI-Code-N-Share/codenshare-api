import { inject } from '@adonisjs/core'
import { UserRepositoryImpl } from '#infrastructure/orm/lucid/repositories/user_repository_impl'
import { Friend } from '#domains/friends/friend_model'
import { UserId } from '#domains/users/user_model'
import { FriendRepositoryImpl } from '#infrastructure/orm/lucid/repositories/friend_repository_impl'
import { CreateFriendDto } from '#domains/friends/friend_dto'
import { FriendException, FriendMessageException } from '#domains/friends/friend_exception'

@inject()
export class FriendService {
  constructor(
    private readonly friendRepository: FriendRepositoryImpl,
    private readonly userRepository: UserRepositoryImpl
  ) {
    this.friendRepository = friendRepository
  }

  async getFollowersByUser(userId: UserId) {
    const user = await this.userRepository.getById(userId)
    return this.friendRepository.getFollowersByUser(user)
  }

  async getFollowingByUser(userId: UserId) {
    const user = await this.userRepository.getById(userId)
    return this.friendRepository.getFollowingByUser(user)
  }

  async follow(friendCreateDto: CreateFriendDto) {
    const { followerId, followedId } = friendCreateDto
    const follower = await this.userRepository.getById(followerId)
    const followed = await this.userRepository.getById(followedId)

    const isFollowing = await this.friendRepository.isFollowing(follower, followed)
    if (isFollowing) throw new FriendException(FriendMessageException.FRIEND_ALREADY_EXISTS)

    const newFriend = Friend.new(follower, followed)
    return this.friendRepository.create(newFriend)
  }

  async unfollow(followerId: UserId, followedId: UserId) {
    const follower = await this.userRepository.getById(followerId)
    const followed = await this.userRepository.getById(followedId)

    const isFollowing = await this.friendRepository.isFollowing(follower, followed)
    if (!isFollowing) throw new FriendException(FriendMessageException.FRIEND_NOT_FOUND)

    return this.friendRepository.delete(follower, followed)
  }
}
