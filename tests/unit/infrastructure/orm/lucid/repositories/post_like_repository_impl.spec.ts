import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { PostLikeEntity } from '#infrastructure/orm/lucid/entities/post_like_entity'
import { PostLikeRepositoryImpl } from '#infrastructure/orm/lucid/repositories/post_like_repository_impl'
import { UserSample } from '#tests/unit/domains/utils/user_sample'
import { PostSample } from '#tests/unit/domains/utils/post_sample'
import { PostLike } from '#domains/posts/post_like/post_like_model'
import { DateTime } from 'luxon'

test.group('PostLikeRepositoryImpl - IsPostLiked', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return true if post is liked by a user', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const post = PostSample.new({ postId: '1' })

    const queryStub = {
      where: sinon.stub().returnsThis(),
      first: sinon.stub().resolves(new PostLikeEntity()),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(PostLikeEntity, 'query').returns(queryStub)

    const postLikeRepository = new PostLikeRepositoryImpl()
    const result = await postLikeRepository.isPostLiked(post.postId, user.userId)

    assert.isTrue(result)

    lucidStub.restore()
  })

  test('should return false if post is not liked by a user', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const post = PostSample.new({ postId: '1' })

    const queryStub = {
      where: sinon.stub().returnsThis(),
      first: sinon.stub().resolves(null),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(PostLikeEntity, 'query').returns(queryStub)

    const postLikeRepository = new PostLikeRepositoryImpl()
    const result = await postLikeRepository.isPostLiked(post.postId, user.userId)

    assert.isFalse(result)

    lucidStub.restore()
  })
})

test.group('PostLikeRepositoryImpl - getByPostAndUser', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return a post like by a specific user and post', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const post = PostSample.new({ postId: '1' })

    const postLikeEntity = new PostLikeEntity()
    postLikeEntity.liked_at = DateTime.now()

    const queryStub = {
      where: sinon.stub().returnsThis(),
      firstOrFail: sinon.stub().resolves(postLikeEntity),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(PostLikeEntity, 'query').returns(queryStub)

    const postLikeRepository = new PostLikeRepositoryImpl()
    const result = await postLikeRepository.getByPostAndUser(post.postId, user.userId)

    assert.exists(result)

    lucidStub.restore()
  })
})

test.group('PostLikeRepositoryImpl - create', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should create a new post like', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const post = PostSample.new({ postId: '1' })
    const postLike = PostLike.new(post.postId, user.userId)

    const postLikeEntity = new PostLikeEntity()
    postLikeEntity.postLikeId = '1'

    const createStub = sinon.stub(PostLikeEntity, 'create').resolves(postLikeEntity)

    const postLikeRepository = new PostLikeRepositoryImpl()
    const result = await postLikeRepository.create(postLike)

    assert.exists(result)

    createStub.restore()
  })
})
test.group('PostLikeRepositoryImpl - delete', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should delete a post like', async ({ assert }) => {
    const postLikeId = '1'
    const postLikeEntity = new PostLikeEntity()

    const deleteStub = sinon.stub(postLikeEntity, 'delete').resolves()
    const findOrFailStub = sinon.stub(PostLikeEntity, 'findOrFail').resolves(postLikeEntity)

    const postLikeRepository = new PostLikeRepositoryImpl()
    await postLikeRepository.delete(postLikeId)

    assert.isTrue(deleteStub.calledOnce)

    findOrFailStub.restore()
    deleteStub.restore()
  })
})
