import { test } from '@japa/runner'
import sinon from 'sinon'
import UserController from '#presentation/rest/adonis/controllers/user_controller'
import { UserService } from '#domains/users/user_service'
import { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import { UserSample } from '#tests/unit/domains/utils/user_sample'

test.group('UserController - Search', () => {
  test('should search for a user', async ({ assert }) => {
    // Arrange
    const userServiceStub = sinon.createStubInstance(UserService)
    userServiceStub.search.resolves([UserSample.new({})])
    const userController = new UserController(userServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        json: sinon.fake(),
      },
      request: {
        qs: sinon.fake.returns({ query: 'Test' }),
      },
    } as unknown as HttpContext

    // Act
    await userController.search(ctx)

    // Assert
    assert.isTrue(userServiceStub.search.calledOnce)
  })

  test('should return error 400 if something goes wrong', async ({ assert }) => {
    // Arrange
    const userServiceStub = sinon.createStubInstance(UserService)
    userServiceStub.search.rejects(new Error('Bad Request'))
    const userController = new UserController(userServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        qs: sinon.fake.returns({ query: 'Test' }),
      },
    } as unknown as HttpContext

    // Act
    try {
      await userController.search(ctx)
    } catch (e) {
      assert.equal(e.message, 'Bad Request')
      assert.isTrue(userServiceStub.search.calledOnce)
    }
  })
})

test.group('UserController - Find', () => {
  test('should find a user', async ({ assert }) => {
    // Arrange
    const userServiceStub = sinon.createStubInstance(UserService)
    userServiceStub.getById.resolves(UserSample.new({}))
    const userController = new UserController(userServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      params: {
        userId: randomUUID(),
      },
    } as unknown as HttpContext

    // Act
    await userController.find(ctx)

    // Assert
    assert.isTrue(userServiceStub.getById.calledOnce)
  })

  test('should return error 404 if something goes wrong', async ({ assert }) => {
    // Arrange
    const userServiceStub = sinon.createStubInstance(UserService)
    userServiceStub.getById.rejects(new Error('Not Found'))
    const userController = new UserController(userServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      params: {
        userId: '1',
      },
    } as unknown as HttpContext

    // Act
    try {
      await userController.find(ctx)
    } catch (e) {
      assert.equal(e.message, 'Not Found')
      assert.isTrue(userServiceStub.getById.calledOnce)
    }
  })
})

test.group('UserController - Delete', () => {
  test('should delete a user', async ({ assert }) => {
    // Arrange
    const userServiceStub = sinon.createStubInstance(UserService)
    userServiceStub.delete.resolves()
    const userController = new UserController(userServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      params: {
        userId: randomUUID(),
      },
    } as unknown as HttpContext

    // Act
    await userController.delete(ctx)

    // Assert
    assert.isTrue(userServiceStub.delete.calledOnce)
  })

  test('should return error 404 if something goes wrong', async ({ assert }) => {
    // Arrange
    const userServiceStub = sinon.createStubInstance(UserService)
    userServiceStub.delete.rejects(new Error('Not Found'))
    const userController = new UserController(userServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      params: {
        userId: '1',
      },
    } as unknown as HttpContext

    // Act
    try {
      await userController.delete(ctx)
    } catch (e) {
      assert.equal(e.message, 'Not Found')
      assert.isTrue(userServiceStub.delete.calledOnce)
    }
  })
})
