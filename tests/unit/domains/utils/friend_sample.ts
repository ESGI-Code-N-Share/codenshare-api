import { Friend } from '#domains/friends/friend_model'
import { UserSample } from '#tests/unit/domains/utils/user_sample'

export class FriendSample {
  static new(friendData: Partial<Friend>) {
    return {
      friendId: friendData.friendId ?? '1',
      requestedBy: friendData.requestedBy ?? UserSample.new({ userId: '1' }),
      addressedTo: friendData.addressedTo ?? UserSample.new({ userId: '2' }),
      createdAt: friendData.createdAt ?? new Date(),
    }
  }
}
