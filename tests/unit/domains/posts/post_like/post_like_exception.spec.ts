import { test } from '@japa/runner'
import {
  PostLikeException,
  PostLikeMessageException,
} from '#domains/posts/post_like/post_like_exception'

test.group('PostLikeException', () => {
  test('should create a PostLikeException with the correct message', ({ assert }) => {
    const message = PostLikeMessageException.ALREADY_LIKED
    const exception = new PostLikeException(message)

    assert.instanceOf(exception, PostLikeException)
    assert.equal(exception.name, 'PostLikeException')
    assert.equal(exception.message, message)
  })

  test('should throw a PostLikeException with the correct message', ({ assert }) => {
    const message = PostLikeMessageException.ALREADY_LIKED
    assert.throws(() => {
      throw new PostLikeException(message)
    }, message)
  })
})
