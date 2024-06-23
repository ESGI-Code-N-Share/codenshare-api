import { test } from '@japa/runner'
import { FriendException, FriendMessageException } from '#domains/friends/friend_exception'

test.group('FriendException', () => {
  test('should create a FriendException with the correct message', ({ assert }) => {
    const message = FriendMessageException.FRIEND_NOT_FOUND
    const exception = new FriendException(message)

    assert.instanceOf(exception, FriendException)
    assert.equal(exception.name, 'FriendException')
    assert.equal(exception.message, message)
  })

  test('should throw a FriendException with the correct message', ({ assert }) => {
    const message = FriendMessageException.FRIEND_NOT_FOUND
    assert.throws(() => {
      throw new FriendException(message)
    }, message)
  })
})
