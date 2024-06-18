import { inject } from '@adonisjs/core'
import { Friend } from '#domains/friends/friend_model'
import { UserId } from '#domains/users/user_model'
import { FriendRepositoryImpl } from '#infrastructure/orm/lucid/repositories/friend_repository_impl'
import { CreateFriendDto } from '#domains/friends/friend_dto'
import { FriendException, FriendMessageException } from '#domains/friends/friend_exception'
import { UserService } from '#domains/users/user_service'

@inject()
export class FriendService {
  constructor(
    private readonly friendRepository: FriendRepositoryImpl,
    private readonly userService: UserService
  ) {
    this.friendRepository = friendRepository
  }

  async getFollowersByUser(userId: UserId) {
    const user = await this.userService.getById(userId)
    return this.friendRepository.getFollowersByUser(user)
  }

  async getFollowingByUser(userId: UserId) {
    const user = await this.userService.getById(userId)
    return this.friendRepository.getFollowingByUser(user)
  }

  async follow(friendCreateDto: CreateFriendDto) {
    const { followerId, followedId } = friendCreateDto
    const follower = await this.userService.getById(followerId)
    const followed = await this.userService.getById(followedId)

    const isFollowing = await this.friendRepository.isFollowing(follower, followed)
    if (isFollowing) throw new FriendException(FriendMessageException.FRIEND_ALREADY_EXISTS)

    const newFriend = Friend.new(follower, followed)
    return this.friendRepository.create(newFriend)
  }

  async unfollow(followerId: UserId, followedId: UserId) {
    const follower = await this.userService.getById(followerId)
    const followed = await this.userService.getById(followedId)

    const isFollowing = await this.friendRepository.isFollowing(follower, followed)
    if (!isFollowing) throw new FriendException(FriendMessageException.FRIEND_NOT_FOUND)

    return this.friendRepository.delete(follower, followed)
  }
}
