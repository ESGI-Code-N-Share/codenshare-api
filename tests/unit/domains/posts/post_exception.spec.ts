import { test } from '@japa/runner'
import { PostException, PostMessageException } from '#domains/posts/post_exception'

test.group('PostException', () => {
  test('should create a PostException with the correct message', ({ assert }) => {
    const message = PostMessageException.POST_NOT_FOUND
    const exception = new PostException(message)

    assert.instanceOf(exception, PostException)
    assert.equal(exception.name, 'PostException')
    assert.equal(exception.message, message)
  })

  test('should throw a PostException with the correct message', ({ assert }) => {
    const message = PostMessageException.POST_NOT_FOUND
    assert.throws(() => {
      throw new PostException(message)
    }, message)
  })
})
