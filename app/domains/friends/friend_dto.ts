import { type UserId } from '#domains/users/user_model'

export interface CreateFriendDto {
  followerId: UserId
  followedId: UserId
}

export interface DeleteFriendDto {
  followerId: UserId
  followedId: UserId
}
