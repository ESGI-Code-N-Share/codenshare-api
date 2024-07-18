import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { DateTime } from 'luxon'
import { User } from '#domains/users/user_model'
import Post from '#domains/posts/post_model'
import { PostLike } from '#domains/posts/post_like/post_like_model'
import { PostLikeEntity } from '#infrastructure/orm/lucid/entities/post_like_entity'
import UserEntity from '#infrastructure/orm/lucid/entities/user_entity'
import PostEntity from '#infrastructure/orm/lucid/entities/post_entity'
import { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

test.group('PostEntity', () => {
  test('should convert to domain', async ({ assert }) => {
    const postId = '1'
    const postedAt = DateTime.now()
    const author: User = {
      userId: '1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@email.com',
      birthdate: new Date('1990-01-01'),
      avatar: 'avatar.png',
      emailVerified: true,
      role: 'user',
      overview: '',
      password: '',
      createdAt: DateTime.now().toJSDate(),
      token: 'token',
    }
    const likes: PostLike[] = [
      {
        postLikeId: '1',
        userId: author.userId,
        postId: postId,
        likedAt: DateTime.now().toJSDate(),
      },
    ]

    const expected: Post = {
      postId: postId,
      title: 'Hello, World!',
      content: 'Hello, World!',
      author: author,
      postedAt: postedAt.toJSDate(),
      image: undefined,
      programId: undefined,
      likes: likes,
    }

    const userEntityStub = sinon.stub(UserEntity.prototype, 'toDomain').returns(author)
    const postLikeEntityStub = sinon.stub(PostLikeEntity.prototype, 'toDomain').returns(likes[0])

    const postEntity = new PostEntity()
    postEntity.postId = expected.postId
    postEntity.title = expected.title
    postEntity.content = expected.content
    postEntity.authorId = expected.author.userId
    postEntity.author = new UserEntity() as BelongsTo<typeof UserEntity>
    postEntity.likes = [new PostLikeEntity()] as HasMany<typeof PostLikeEntity>
    postEntity.postedAt = postedAt

    const result = postEntity.toDomain()

    assert.deepEqual(result, expected)

    userEntityStub.restore()
    postLikeEntityStub.restore()
  })
})
