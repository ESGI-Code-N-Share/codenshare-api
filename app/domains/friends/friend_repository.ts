import { Friend, type FriendId } from '#domains/friends/friend_model'
import { User } from '#domains/users/user_model'

export interface FriendRepositoryPort {
  isFollowing(follower: User, followed: User): Promise<boolean>

  create(friend: Friend): Promise<Friend>

  delete(follower: User, followed: User): Promise<FriendId>
}
