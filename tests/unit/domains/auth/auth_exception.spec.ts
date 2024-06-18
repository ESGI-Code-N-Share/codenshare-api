import { test } from '@japa/runner'
import { AuthException, AuthMessageException } from '#domains/auth/auth_exception'

test.group('AuthException', () => {
  test('should create a AuthException with the correct message', ({ assert }) => {
    const message = AuthMessageException.USER_WITH_CREDENTIALS_NOT_FOUND
    const exception = new AuthException(message)

    assert.instanceOf(exception, AuthException)
    assert.equal(exception.name, 'AuthException')
    assert.equal(exception.message, message)
  })

  test('should throw a AuthException with the correct message', ({ assert }) => {
    const message = AuthMessageException.USER_WITH_CREDENTIALS_NOT_FOUND
    assert.throws(() => {
      throw new AuthException(message)
    }, message)
  })
})
