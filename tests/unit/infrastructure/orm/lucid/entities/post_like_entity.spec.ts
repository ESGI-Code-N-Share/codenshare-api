import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { PostLike } from '#domains/posts/post_like/post_like_model'
import { PostLikeEntity } from '#infrastructure/orm/lucid/entities/post_like_entity'

test.group('PostLikeEntity', () => {
  test('should convert to domain', async ({ assert }) => {
    const likedAt = DateTime.now()
    const authorId = '2'

    const expected: PostLike = {
      postLikeId: '1',
      userId: authorId,
      postId: '1',
      likedAt: likedAt.toJSDate(),
    }

    const postLikeEntity = new PostLikeEntity()
    postLikeEntity.postLikeId = expected.postLikeId
    postLikeEntity.userId = expected.userId
    postLikeEntity.postId = expected.postId
    postLikeEntity.liked_at = likedAt

    const result = postLikeEntity.toDomain()

    assert.equal(result.postLikeId, expected.postLikeId)
    assert.equal(result.postId, expected.postId)
  })
})
