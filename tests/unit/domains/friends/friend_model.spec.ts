import { test } from '@japa/runner'
import { Friend } from '#domains/friends/friend_model'
import { UserSample } from '#tests/unit/domains/utils/user_sample'

test.group('FriendModel', () => {
  test('should create a new friend', ({ assert }) => {
    const requestedBy = UserSample.new({ userId: '1' })
    const addressedTo = UserSample.new({ userId: '2' })

    const expected: Friend = {
      friendId: '1',
      requestedBy,
      addressedTo,
      createdAt: new Date(),
    }

    const friend = Friend.new(requestedBy, addressedTo)

    assert.exists(friend.friendId)
    assert.deepEqual(friend.requestedBy, expected.requestedBy)
    assert.deepEqual(friend.addressedTo, expected.addressedTo)
    assert.exists(friend.createdAt)
  })

  test('should create a new friend from persistence', ({ assert }) => {
    const requestedBy = UserSample.new({ userId: '1' })
    const addressedTo = UserSample.new({ userId: '2' })

    const expected: Friend = {
      friendId: '1',
      requestedBy,
      addressedTo,
      createdAt: new Date(),
    }

    const friend = Friend.fromPersistence(expected)

    assert.exists(friend.friendId)
    assert.deepEqual(friend.requestedBy, expected.requestedBy)
    assert.deepEqual(friend.addressedTo, expected.addressedTo)
    assert.exists(friend.createdAt)
  })
})
