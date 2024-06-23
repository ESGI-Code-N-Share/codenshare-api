import { test } from '@japa/runner'
import * as sinon from 'sinon'
import PostEntity from '#infrastructure/orm/lucid/entities/post_entity'
import { PostRepositoryImpl } from '#infrastructure/orm/lucid/repositories/post_repository_impl'
import { PostSample } from '#tests/unit/domains/utils/post_sample'
import { UserSample } from '#tests/unit/domains/utils/user_sample'

test.group('PostRepositoryImpl - GetAll', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return all posts', async ({ assert }) => {
    const post = PostSample.new({ postId: '1' })

    const toDomainStub = sinon.stub(PostEntity.prototype, 'toDomain').returns(post)
    const queryStub = {
      preload: sinon.stub().returnsThis(),
      whereNull: sinon.stub().returnsThis(),
      orderBy: sinon.stub().returnsThis(),
      map: sinon.stub().returns([post]),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(PostEntity, 'query').returns(queryStub)

    const postRepository = new PostRepositoryImpl()
    const result = await postRepository.getAll()

    assert.deepEqual(result, [post])

    lucidStub.restore()
    toDomainStub.restore()
  })
})

test.group('PostRepositoryImpl - getByUser', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return posts for a specific user', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const post = PostSample.new({ postId: '1', author: user })

    const toDomainStub = sinon.stub(PostEntity.prototype, 'toDomain').returns(post)
    const queryStub = {
      preload: sinon.stub().returnsThis(),
      where: sinon.stub().returnsThis(),
      whereNull: sinon.stub().returnsThis(),
      orderBy: sinon.stub().returnsThis(),
      map: sinon.stub().returns([post]),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(PostEntity, 'query').returns(queryStub)

    const postRepository = new PostRepositoryImpl()
    const result = await postRepository.getByUser(user.userId)

    assert.deepEqual(result, [post])

    lucidStub.restore()
    toDomainStub.restore()
  })
})

test.group('PostRepositoryImpl - getById', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return a specific post', async ({ assert }) => {
    const postId = '1'
    const post = PostSample.new({ postId })

    const toDomainStub = sinon.stub(PostEntity.prototype, 'toDomain').returns(post)
    const queryStub = {
      preload: sinon.stub().returnsThis(),
      where: sinon.stub().returnsThis(),
      whereNull: sinon.stub().returnsThis(),
      firstOrFail: sinon.stub().resolves(new PostEntity()),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(PostEntity, 'query').returns(queryStub)

    const postRepository = new PostRepositoryImpl()
    const result = await postRepository.getById(postId)

    assert.deepEqual(result, post)

    lucidStub.restore()
    toDomainStub.restore()
  })
})

test.group('PostRepositoryImpl - create', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should create a new post', async ({ assert }) => {
    const post = PostSample.new({ postId: '1' })

    const createStub = sinon.stub(PostEntity, 'create').resolves(new PostEntity())
    const toDomainStub = sinon.stub(PostEntity.prototype, 'toDomain').returns(post)
    const queryStub = {
      where: sinon.stub().returnsThis(),
      preload: sinon.stub().returnsThis(),
      firstOrFail: sinon.stub().resolves(new PostEntity()),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(PostEntity, 'query').returns(queryStub)

    const postRepository = new PostRepositoryImpl()
    const result = await postRepository.create(post)

    assert.deepEqual(result, post)

    createStub.restore()
    lucidStub.restore()
    toDomainStub.restore()
  })
})

test.group('PostRepositoryImpl - delete', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should delete a post', async ({ assert }) => {
    const postId = '1'
    const postEntity = new PostEntity()

    const saveStub = sinon.stub(postEntity, 'save').resolves()
    const findOrFailStub = sinon.stub(PostEntity, 'findOrFail').resolves(postEntity)

    const postRepository = new PostRepositoryImpl()
    await postRepository.delete(postId)

    assert.isTrue(saveStub.calledOnce)

    findOrFailStub.restore()
    saveStub.restore()
  })
})
