import { test } from '@japa/runner'
import * as sinon from 'sinon'
import FriendEntity from '#infrastructure/orm/lucid/entities/friend_entity'
import { FriendRepositoryImpl } from '#infrastructure/orm/lucid/repositories/friend_repository_impl'
import { UserSample } from '#tests/unit/domains/utils/user_sample'
import { FriendSample } from '#tests/unit/domains/utils/friend_sample'

test.group('FriendRepositoryImpl - GetFollowersByUser', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return all followers of a user', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const friend = FriendSample.new({ friendId: '1', addressedTo: user })

    const toDomainStub = sinon.stub(FriendEntity.prototype, 'toDomain').returns(friend)
    const queryStub = {
      where: sinon.stub().returnsThis(),
      preload: sinon.stub().returnsThis(),
      map: sinon.stub().returns([friend]),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(FriendEntity, 'query').returns(queryStub)

    const friendRepository = new FriendRepositoryImpl()
    const result = await friendRepository.getFollowersByUser(user)

    assert.deepEqual(result, [friend])

    lucidStub.restore()
    toDomainStub.restore()
  })
})

test.group('FriendRepositoryImpl - getFollowingByUser', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return all users followed by a specific user', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const friend = FriendSample.new({ friendId: '1', requestedBy: user })

    const toDomainStub = sinon.stub(FriendEntity.prototype, 'toDomain').returns(friend)
    const queryStub = {
      where: sinon.stub().returnsThis(),
      preload: sinon.stub().returnsThis(),
      map: sinon.stub().returns([friend]),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(FriendEntity, 'query').returns(queryStub)

    const friendRepository = new FriendRepositoryImpl()
    const result = await friendRepository.getFollowingByUser(user)

    assert.deepEqual(result, [friend])

    lucidStub.restore()
    toDomainStub.restore()
  })
})

test.group('FriendRepositoryImpl - isFollowing', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return true if user is following another user', async ({ assert }) => {
    const follower = UserSample.new({ userId: '1' })
    const followed = UserSample.new({ userId: '2' })

    const queryStub = {
      where: sinon.stub().returnsThis(),
      first: sinon.stub().resolves(new FriendEntity()),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(FriendEntity, 'query').returns(queryStub)

    const friendRepository = new FriendRepositoryImpl()
    const result = await friendRepository.isFollowing(follower, followed)

    assert.isTrue(result)

    lucidStub.restore()
  })
})

test.group('FriendRepositoryImpl - create', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should create a new friend', async ({ assert }) => {
    const friend = FriendSample.new({ friendId: '1' })

    const createStub = sinon.stub(FriendEntity, 'create').resolves(new FriendEntity())
    const toDomainStub = sinon.stub(FriendEntity.prototype, 'toDomain').returns(friend)
    const queryStub = {
      where: sinon.stub().returnsThis(),
      preload: sinon.stub().returnsThis(),
      firstOrFail: sinon.stub().resolves(new FriendEntity()),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(FriendEntity, 'query').returns(queryStub)

    const friendRepository = new FriendRepositoryImpl()
    const result = await friendRepository.create(friend)

    assert.deepEqual(result, friend)

    createStub.restore()
    lucidStub.restore()
    toDomainStub.restore()
  })
})

test.group('FriendRepositoryImpl - delete', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should delete a friend', async ({ assert }) => {
    const follower = UserSample.new({ userId: '1' })
    const followed = UserSample.new({ userId: '2' })
    const friendEntity = new FriendEntity()

    const deleteStub = sinon.stub(friendEntity, 'delete').resolves()
    const queryStub = {
      where: sinon.stub().returnsThis(),
      firstOrFail: sinon.stub().resolves(friendEntity),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(FriendEntity, 'query').returns(queryStub)

    const friendRepository = new FriendRepositoryImpl()
    await friendRepository.delete(follower, followed)

    assert.isTrue(deleteStub.calledOnce)

    lucidStub.restore()
    deleteStub.restore()
  })
})
