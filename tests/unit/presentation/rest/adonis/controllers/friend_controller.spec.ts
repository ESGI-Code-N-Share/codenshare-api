import { test } from '@japa/runner'
import sinon from 'sinon'
import FriendController from '#presentation/rest/adonis/controllers/friend_controller'
import { FriendService } from '#domains/friends/friend_service'
import { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import { FriendSample } from '#tests/unit/domains/utils/friend_sample'

test.group('FriendController - getFollowersByUser', () => {
  test('should get followers by user', async ({ assert }) => {
    // Arrange
    const friendServiceStub = sinon.createStubInstance(FriendService)
    friendServiceStub.getFollowersByUser.resolves([])
    const friendController = new FriendController(friendServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        qs: sinon.fake.returns({ userId: randomUUID() }),
      },
    } as unknown as HttpContext

    // Act
    await friendController.getFollowersByUser(ctx)

    // Assert
    assert.isTrue(friendServiceStub.getFollowersByUser.calledOnce)
  })

  test('should return error 400 if something goes wrong', async ({ assert }) => {
    // Arrange
    const friendServiceStub = sinon.createStubInstance(FriendService)
    friendServiceStub.getFollowersByUser.rejects(new Error('Bad Request'))
    const friendController = new FriendController(friendServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        qs: sinon.fake.returns({ userId: '1' }),
      },
    } as unknown as HttpContext

    // Act
    try {
      await friendController.getFollowersByUser(ctx)
    } catch (e) {
      assert.equal(e.message, 'Bad Request')
      assert.isTrue(friendServiceStub.getFollowersByUser.calledOnce)
    }
  })
})

test.group('FriendController - getFollowingByUser', () => {
  test('should get following by user', async ({ assert }) => {
    // Arrange
    const friendServiceStub = sinon.createStubInstance(FriendService)
    friendServiceStub.getFollowingByUser.resolves([])
    const friendController = new FriendController(friendServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        qs: sinon.fake.returns({ userId: randomUUID() }),
      },
    } as unknown as HttpContext

    // Act
    await friendController.getFollowingByUser(ctx)

    // Assert
    assert.isTrue(friendServiceStub.getFollowingByUser.calledOnce)
  })

  test('should return error 400 if something goes wrong', async ({ assert }) => {
    // Arrange
    const friendServiceStub = sinon.createStubInstance(FriendService)
    friendServiceStub.getFollowingByUser.rejects(new Error('Bad Request'))
    const friendController = new FriendController(friendServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        qs: sinon.fake.returns({ userId: '1' }),
      },
    } as unknown as HttpContext

    // Act
    try {
      await friendController.getFollowingByUser(ctx)
    } catch (e) {
      assert.equal(e.message, 'Bad Request')
      assert.isTrue(friendServiceStub.getFollowingByUser.calledOnce)
    }
  })
})

test.group('FriendController - create', () => {
  test('should create a friend', async ({ assert }) => {
    // Arrange
    const friendServiceStub = sinon.createStubInstance(FriendService)
    friendServiceStub.follow.resolves(FriendSample.new({}))
    const friendController = new FriendController(friendServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({ followerId: randomUUID(), followedId: randomUUID() }),
      },
    } as unknown as HttpContext

    // Act
    await friendController.create(ctx)

    // Assert
    assert.isTrue(friendServiceStub.follow.calledOnce)
  })

  test('should return error 400 if something goes wrong', async ({ assert }) => {
    // Arrange
    const friendServiceStub = sinon.createStubInstance(FriendService)
    friendServiceStub.follow.rejects(new Error('Bad Request'))
    const friendController = new FriendController(friendServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({ followerId: '1', followedId: '1' }),
      },
    } as unknown as HttpContext

    // Act
    try {
      await friendController.create(ctx)
    } catch (e) {
      assert.equal(e.message, 'Bad Request')
      assert.isTrue(friendServiceStub.follow.calledOnce)
    }
  })
})

test.group('FriendController - delete', () => {
  test('should delete a friend', async ({ assert }) => {
    // Arrange
    const friendServiceStub = sinon.createStubInstance(FriendService)
    friendServiceStub.unfollow.resolves(randomUUID())
    const friendController = new FriendController(friendServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({ followerId: randomUUID(), followedId: randomUUID() }),
      },
    } as unknown as HttpContext

    // Act
    await friendController.delete(ctx)

    // Assert
    assert.isTrue(friendServiceStub.unfollow.calledOnce)
  })

  test('should return error 400 if something goes wrong', async ({ assert }) => {
    // Arrange
    const friendServiceStub = sinon.createStubInstance(FriendService)
    friendServiceStub.unfollow.rejects(new Error('Bad Request'))
    const friendController = new FriendController(friendServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({ followerId: '1', followedId: '1' }),
      },
    } as unknown as HttpContext

    // Act
    try {
      await friendController.delete(ctx)
    } catch (e) {
      assert.equal(e.message, 'Bad Request')
      assert.isTrue(friendServiceStub.unfollow.calledOnce)
    }
  })
})
