import { test } from '@japa/runner'
import sinon from 'sinon'
import PostLikeController from '#presentation/rest/adonis/controllers/post_like_controller'
import { PostLikeService } from '#domains/posts/post_like/post_like_service'
import { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'

test.group('PostLikeController - Like', () => {
  test('should like a post', async ({ assert }) => {
    // Arrange
    const postLikeServiceStub = sinon.createStubInstance(PostLikeService)
    postLikeServiceStub.likePost.resolves(randomUUID())
    const postLikeController = new PostLikeController(postLikeServiceStub as any)

    const ctx = {
      response: {
        created: sinon.fake(),
        badRequest: sinon.stub(),
      },
      request: {
        all: sinon.fake.returns({ postId: randomUUID(), userId: randomUUID() }),
      },
      params: {},
    } as unknown as HttpContext

    // Act
    await postLikeController.create(ctx)

    // Assert
    assert.isTrue(postLikeServiceStub.likePost.calledOnce)
  })

  test('should return bad request if something goes wrong', async ({ assert }) => {
    let badRequestCounter = 0
    const postLikeServiceStub = sinon.createStubInstance(PostLikeService)

    postLikeServiceStub.likePost.rejects(new Error('Something went wrong'))

    const postLikeController = new PostLikeController(postLikeServiceStub as any)

    const ctx = {
      response: {
        ok: sinon.fake(),
        badRequest: () => {
          badRequestCounter++
        },
      },
      request: {
        all: sinon.fake.returns({ postId: randomUUID(), userId: randomUUID() }),
      },
      params: {},
    } as unknown as HttpContext

    await postLikeController.create(ctx)

    // Assert
    assert.equal(badRequestCounter, 1)
  })
})

test.group('PostLikeController - Unlike', () => {
  test('should unlike a post', async ({ assert }) => {
    // Arrange
    const postLikeServiceStub = sinon.createStubInstance(PostLikeService)
    postLikeServiceStub.unlikePost.resolves(randomUUID())
    const postLikeController = new PostLikeController(postLikeServiceStub as any)

    const ctx = {
      response: {
        ok: sinon.fake(),
        badRequest: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({ postId: randomUUID(), userId: randomUUID() }),
      },
      params: {},
    } as unknown as HttpContext

    // Act
    await postLikeController.delete(ctx)

    // Assert
    assert.isTrue(postLikeServiceStub.unlikePost.calledOnce)
  })

  test('should return bad request if something goes wrong', async ({ assert }) => {
    let badRequestCounter = 0
    const postLikeServiceStub = sinon.createStubInstance(PostLikeService)

    postLikeServiceStub.unlikePost.rejects(new Error('Something went wrong'))

    const postLikeController = new PostLikeController(postLikeServiceStub as any)

    const ctx = {
      response: {
        ok: sinon.fake(),
        badRequest: () => {
          badRequestCounter++
        },
      },
      request: {
        all: sinon.fake.returns({ postId: randomUUID(), userId: randomUUID() }),
      },
      params: {},
    } as unknown as HttpContext

    await postLikeController.delete(ctx)

    // Assert
    assert.equal(badRequestCounter, 1)
  })
})
