import { test } from '@japa/runner'
import { UserException, UserMessageException } from '#domains/users/user_exception'

test.group('UserException', () => {
  test('should create a UserException with the correct message', ({ assert }) => {
    const message = UserMessageException.USER_NOT_FOUND
    const exception = new UserException(message)

    assert.instanceOf(exception, UserException)
    assert.equal(exception.name, 'UserException')
    assert.equal(exception.message, message)
  })

  test('should throw a UserException with the correct message', ({ assert }) => {
    const message = UserMessageException.USER_NOT_FOUND
    assert.throws(() => {
      throw new UserException(message)
    }, message)
  })
})
