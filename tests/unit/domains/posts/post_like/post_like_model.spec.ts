import { test } from '@japa/runner'
import { PostLike } from '#domains/posts/post_like/post_like_model'

test.group('PostLikeModel', () => {
  test('should create a new post like', ({ assert }) => {
    const likedAt = new Date()
    const expected: PostLike = {
      postLikeId: '1',
      postId: '2',
      userId: '3',
      likedAt,
    }

    const postLike = PostLike.new(expected.postId, expected.userId)

    assert.exists(postLike.postLikeId)
    assert.equal(postLike.postId, expected.postId)
    assert.equal(postLike.userId, expected.userId)
    assert.exists(postLike.likedAt)
  })

  test('should create a postLike from persistence', ({ assert }) => {
    const expected = {
      postLikeId: '1',
      postId: '2',
      userId: '3',
      likedAt: new Date('2022-01-01'),
    }

    const postLike = PostLike.fromPersistence(expected)

    assert.equal(postLike.postLikeId, expected.postLikeId)
    assert.equal(postLike.postId, expected.postId)
    assert.equal(postLike.userId, expected.userId)
    assert.equal(postLike.likedAt.toISOString(), expected.likedAt.toISOString())
  })
})
