import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { UserRepositoryImpl } from '#infrastructure/orm/lucid/repositories/user_repository_impl'
import { FriendService } from '#domains/friends/friend_service'
import { FriendRepositoryImpl } from '#infrastructure/orm/lucid/repositories/friend_repository_impl'
import { UserService } from '#domains/users/user_service'
import { UserSample } from '#tests/unit/domains/utils/user_sample'
import { FriendSample } from '#tests/unit/domains/utils/friend_sample'

test.group('FriendService - GetFollowersByUser', (group) => {
  let friendService: FriendService
  let friendRepository: FriendRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    friendRepository = new FriendRepositoryImpl()
    userService = new UserService(userRepository)
    friendService = new FriendService(friendRepository, userService)
  })

  test('should get followers by user', async ({ assert }) => {
    const userId = '1'
    const user = UserSample.new({ userId })
    const followers = [
      FriendSample.new({ friendId: '1', requestedBy: user }),
      FriendSample.new({
        friendId: '2',
        requestedBy: user,
      }),
    ]
    const getFollowersByUserStub = sinon
      .stub(friendRepository, 'getFollowersByUser')
      .resolves(followers)
    const getUserByIdStub = sinon.stub(userService, 'getById').resolves(user)

    const result = await friendService.getFollowersByUser(userId)

    assert.exists(result)
    assert.lengthOf(result, 2)
    assert.isTrue(getFollowersByUserStub.calledOnce)
    assert.isTrue(getUserByIdStub.calledOnce)

    getFollowersByUserStub.restore()
    getUserByIdStub.restore()
  })

  test('should get an empty array if no followers', async ({ assert }) => {
    const userId = '1'
    const user = UserSample.new({ userId })
    const getFollowersByUserStub = sinon.stub(friendRepository, 'getFollowersByUser').resolves([])
    const getUserByIdStub = sinon.stub(userService, 'getById').resolves(user)

    const result = await friendService.getFollowersByUser(userId)

    assert.lengthOf(result, 0)
    assert.isTrue(getFollowersByUserStub.calledOnce)
    assert.isTrue(getUserByIdStub.calledOnce)

    getFollowersByUserStub.restore()
    getUserByIdStub.restore()
  })
})

test.group('FriendService - GetFollowingByUser', (group) => {
  let friendService: FriendService
  let friendRepository: FriendRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    friendRepository = new FriendRepositoryImpl()
    userService = new UserService(userRepository)
    friendService = new FriendService(friendRepository, userService)
  })

  test('should get following by user', async ({ assert }) => {
    const userId = '1'
    const user = UserSample.new({ userId })
    const following = [
      FriendSample.new({ friendId: '1', addressedTo: user }),
      FriendSample.new({ friendId: '2', addressedTo: user }),
    ]
    const getFollowingByUserStub = sinon
      .stub(friendRepository, 'getFollowingByUser')
      .resolves(following)
    const getUserByIdStub = sinon.stub(userService, 'getById').resolves(user)

    const result = await friendService.getFollowingByUser(userId)

    assert.exists(result)
    assert.lengthOf(result, 2)
    assert.isTrue(getFollowingByUserStub.calledOnce)
    assert.isTrue(getUserByIdStub.calledOnce)

    getFollowingByUserStub.restore()
    getUserByIdStub.restore()
  })

  test('should get an empty array if no following', async ({ assert }) => {
    const userId = '1'
    const user = UserSample.new({ userId })
    const getFollowingByUserStub = sinon.stub(friendRepository, 'getFollowingByUser').resolves([])
    const getUserByIdStub = sinon.stub(userService, 'getById').resolves(user)

    const result = await friendService.getFollowingByUser(userId)

    assert.lengthOf(result, 0)
    assert.isTrue(getFollowingByUserStub.calledOnce)
    assert.isTrue(getUserByIdStub.calledOnce)

    getFollowingByUserStub.restore()
    getUserByIdStub.restore()
  })
})

test.group('FriendService - Follow', (group) => {
  let friendService: FriendService
  let friendRepository: FriendRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    friendRepository = new FriendRepositoryImpl()
    userService = new UserService(userRepository)
    friendService = new FriendService(friendRepository, userService)
  })

  test('should follow a user', async ({ assert }) => {
    const followerId = '1'
    const followedId = '2'
    const follower = UserSample.new({ userId: followerId })
    const followed = UserSample.new({ userId: followedId })
    const friendCreateDto = {
      followerId,
      followedId,
    }
    const isFollowingStub = sinon.stub(friendRepository, 'isFollowing').resolves(false)
    const getByIdStub = sinon.stub(userService, 'getById')
    getByIdStub.onFirstCall().resolves(follower)
    getByIdStub.onSecondCall().resolves(followed)
    const createStub = sinon
      .stub(friendRepository, 'create')
      .resolves(FriendSample.new({ friendId: '1' }))

    const result = await friendService.follow(friendCreateDto)

    assert.exists(result)
    assert.isTrue(isFollowingStub.calledOnce)
    assert.isTrue(getByIdStub.calledTwice)
    assert.isTrue(createStub.calledOnce)

    isFollowingStub.restore()
    getByIdStub.restore()
    createStub.restore()
  })

  test('should throw FriendException if already following', async ({ assert }) => {
    const followerId = '1'
    const followedId = '2'
    const follower = UserSample.new({ userId: followerId })
    const followed = UserSample.new({ userId: followedId })
    const friendCreateDto = {
      followerId,
      followedId,
    }

    const isFollowingStub = sinon.stub(friendRepository, 'isFollowing').resolves(true)
    const getByIdStub = sinon.stub(userService, 'getById')
    getByIdStub.onFirstCall().resolves(follower)
    getByIdStub.onSecondCall().resolves(followed)

    try {
      await friendService.follow(friendCreateDto)
      assert.fail('Should throw FriendException')
    } catch (e) {
      assert.exists(e)
    }

    isFollowingStub.restore()
    getByIdStub.restore()
  })
})

test.group('FriendService - Unfollow', (group) => {
  let friendService: FriendService
  let friendRepository: FriendRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    friendRepository = new FriendRepositoryImpl()
    userService = new UserService(userRepository)
    friendService = new FriendService(friendRepository, userService)
  })

  test('should unfollow a user', async ({ assert }) => {
    const followerId = '1'
    const followedId = '2'
    const follower = UserSample.new({ userId: followerId })
    const followed = UserSample.new({ userId: followedId })

    const isFollowingStub = sinon.stub(friendRepository, 'isFollowing').resolves(true)
    const getByIdStub = sinon.stub(userService, 'getById')
    getByIdStub.onFirstCall().resolves(follower)
    getByIdStub.onSecondCall().resolves(followed)
    const deleteStub = sinon.stub(friendRepository, 'delete').resolves()

    await friendService.unfollow(followerId, followedId)

    assert.isTrue(isFollowingStub.calledOnce)
    assert.isTrue(getByIdStub.calledTwice)
    assert.isTrue(deleteStub.calledOnce)

    isFollowingStub.restore()
    getByIdStub.restore()
    deleteStub.restore()
  })

  test('should throw FriendException if not following', async ({ assert }) => {
    const followerId = '1'
    const followedId = '2'
    const follower = UserSample.new({ userId: followerId })
    const followed = UserSample.new({ userId: followedId })

    const isFollowingStub = sinon.stub(friendRepository, 'isFollowing').resolves(false)
    const getByIdStub = sinon.stub(userService, 'getById')
    getByIdStub.onFirstCall().resolves(follower)
    getByIdStub.onSecondCall().resolves(followed)

    try {
      await friendService.unfollow(followerId, followedId)
      assert.fail('Should throw FriendException')
    } catch (e) {
      assert.exists(e)
    }

    isFollowingStub.restore()
    getByIdStub.restore()
  })
})
