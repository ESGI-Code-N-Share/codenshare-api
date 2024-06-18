import { test } from '@japa/runner'
import sinon from 'sinon'
import PostController from '#presentation/rest/adonis/controllers/post_controller'
import { PostService } from '#domains/posts/post_service'
import { HttpContext } from '@adonisjs/core/http'
import { PostSample } from '#tests/unit/domains/utils/post_sample'
import { randomUUID } from 'node:crypto'

test.group('PostController - List', (group) => {
  group.teardown(() => {
    sinon.restore()
  })
  test('should return all posts', async ({ assert }) => {
    // Arrange
    const postServiceStub = sinon.createStubInstance(PostService)
    postServiceStub.getAll.resolves([PostSample.new({ postId: '1' })])
    const postController = new PostController(postServiceStub as any)

    const ctx = {
      response: {
        json: sinon.fake(),
      },
      request: {
        qs: sinon.fake.returns({}),
      },
    } as unknown as HttpContext

    // Act
    await postController.list(ctx)

    // Assert
    assert.isTrue(postServiceStub.getAll.calledOnce)
  })

  test('should return all posts for a specific user', async ({ assert }) => {
    // Arrange
    const postServiceStub = sinon.createStubInstance(PostService)
    postServiceStub.getByUser.resolves([PostSample.new({ postId: '1' })])
    const postController = new PostController(postServiceStub as any)

    const ctx = {
      response: {
        json: sinon.fake(),
      },
      request: {
        qs: sinon.fake.returns({ userId: '1' }),
      },
    } as unknown as HttpContext

    // Act
    await postController.list(ctx)

    // Assert
    assert.isTrue(postServiceStub.getByUser.calledOnce)
  })

  test('should response error 500 if something goes wrong', async ({ assert }) => {
    // Arrange
    const postServiceStub = sinon.createStubInstance(PostService)
    postServiceStub.getAll.rejects(new Error('Internal Server Error'))
    const postController = new PostController(postServiceStub as any)

    const ctx = {
      response: {
        json: sinon.mock(),
        badGateway: sinon.fake(),
        getStatus: sinon.fake(),
      },
      request: {
        qs: sinon.fake.returns({}),
      },
    } as unknown as HttpContext

    // Act
    try {
      await postController.list(ctx)
    } catch (e) {
      assert.isTrue(postServiceStub.getAll.calledOnce)
      assert.equal(e.message, 'Internal Server Error')
    }
  })
})

test.group('PostController - Create', (group) => {
  group.teardown(() => {
    sinon.restore()
  })
  test('should create a new post', async ({ assert }) => {
    // Arrange
    const postServiceStub = sinon.createStubInstance(PostService)
    postServiceStub.create.resolves(PostSample.new({ postId: '1' }))
    const postController = new PostController(postServiceStub as any)

    const ctx = {
      response: {
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
        badGateway: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({
          title: 'Title',
          content: 'Content',
          authorId: randomUUID(),
          image: 'Image',
        }),
      },
    } as unknown as HttpContext

    // Act
    await postController.create(ctx)

    // Assert
    assert.isTrue(postServiceStub.create.calledOnce)
  })

  test('should response error 400 if something goes wrong', async ({ assert }) => {
    // Arrange
    const postServiceStub = sinon
      .createStubInstance(PostService)
      .create.rejects(new Error('Bad Request'))
    const postController = new PostController(postServiceStub as any)

    const ctx = {
      response: {
        json: sinon.mock(),
        status: sinon.fake(),
        badGateway: sinon.stub(),
        getStatus: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({
          title: 'Title',
          content: 'Content',
          authorId: randomUUID(),
          image: 'Image',
        }),
      },
    } as unknown as HttpContext

    // Act
    try {
      await postController.create(ctx)
    } catch (e) {
      assert.equal(e.message, 'Bad Request')
      assert.isTrue(postServiceStub.calledOnce)
    }
  })
})

test.group('PostController - Delete', (group) => {
  group.teardown(() => {
    sinon.restore()
  })
  test('should delete a post', async ({ assert }) => {
    // Arrange
    const postServiceStub = sinon.createStubInstance(PostService)
    postServiceStub.delete.resolves('1')
    const postController = new PostController(postServiceStub as any)

    const ctx = {
      response: {
        json: sinon.fake(),
        status: sinon.stub().returnsThis(),
      },
      params: {
        postId: randomUUID(),
      },
    } as unknown as HttpContext

    // Act
    await postController.delete(ctx)

    // Assert
    assert.isTrue(postServiceStub.delete.calledOnce)
  })

  test('should response error 404 if something goes wrong', async ({ assert }) => {
    // Arrange
    const postServiceStub = sinon.createStubInstance(PostService)
    postServiceStub.delete.rejects(new Error('Not Found'))
    const postController = new PostController(postServiceStub as any)

    const ctx = {
      response: {
        json: sinon.fake(),
        status: sinon.stub().returnsThis(),
        badGateway: sinon.stub(),
        getStatus: sinon.fake(),
      },
      params: {
        postId: '1',
      },
    } as unknown as HttpContext

    // Act
    try {
      await postController.delete(ctx)
    } catch (e) {
      assert.equal(e.message, 'Not Found')
      assert.isTrue(postServiceStub.delete.calledOnce)
    }
  })
})
