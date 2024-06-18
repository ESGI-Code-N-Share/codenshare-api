import { test } from '@japa/runner'
import sinon from 'sinon'
import ConversationController from '#presentation/rest/adonis/controllers/conversation_controller'
import { ConversationService } from '#domains/users/conversations/conversation_service'
import { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import { ConversationSample } from '#tests/unit/domains/utils/conversation_sample'

test.group('ConversationController - getByUser', () => {
  test('should get conversations by user', async ({ assert }) => {
    // Arrange
    const conversationServiceStub = sinon.createStubInstance(ConversationService)
    conversationServiceStub.getByUser.resolves([])
    const conversationController = new ConversationController(conversationServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        json: sinon.fake(),
      },
      params: {
        userId: randomUUID(),
      },
    } as unknown as HttpContext

    // Act
    await conversationController.getByUser(ctx)

    // Assert
    assert.isTrue(conversationServiceStub.getByUser.calledOnce)
  })

  test('should return error 400 if something goes wrong', async ({ assert }) => {
    // Arrange
    const conversationServiceStub = sinon.createStubInstance(ConversationService)
    conversationServiceStub.getByUser.rejects(new Error('Bad Request'))
    const conversationController = new ConversationController(conversationServiceStub as any)

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
      await conversationController.getByUser(ctx)
    } catch (e) {
      assert.equal(e.message, 'Bad Request')
      assert.isTrue(conversationServiceStub.getByUser.calledOnce)
    }
  })
})

test.group('ConversationController - create', () => {
  test('should create a conversation', async ({ assert }) => {
    // Arrange
    const conversationServiceStub = sinon.createStubInstance(ConversationService)
    conversationServiceStub.create.resolves(ConversationSample.new({}))
    const conversationController = new ConversationController(conversationServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        json: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({ userId: randomUUID(), memberIds: [randomUUID(), randomUUID()] }),
      },
    } as unknown as HttpContext

    // Act
    await conversationController.create(ctx)

    // Assert
    assert.isTrue(conversationServiceStub.create.calledOnce)
  })

  test('should return error 400 if something goes wrong', async ({ assert }) => {
    // Arrange
    const conversationServiceStub = sinon.createStubInstance(ConversationService)
    conversationServiceStub.create.rejects(new Error('Bad Request'))
    const conversationController = new ConversationController(conversationServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({ userId: '1', memberIds: ['1', '2'] }),
      },
    } as unknown as HttpContext

    // Act
    try {
      await conversationController.create(ctx)
    } catch (e) {
      assert.equal(e.message, 'Bad Request')
      assert.isTrue(conversationServiceStub.create.calledOnce)
    }
  })
})

test.group('ConversationController - delete', () => {
  test('should delete a conversation', async ({ assert }) => {
    // Arrange
    const conversationServiceStub = sinon.createStubInstance(ConversationService)
    conversationServiceStub.leave.resolves(randomUUID())
    const conversationController = new ConversationController(conversationServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        json: sinon.fake(),
      },
      params: {
        userId: randomUUID(),
        conversationId: randomUUID(),
      },
    } as unknown as HttpContext

    // Act
    await conversationController.delete(ctx)

    // Assert
    assert.isTrue(conversationServiceStub.leave.calledOnce)
  })

  test('should return error 400 if something goes wrong', async ({ assert }) => {
    // Arrange
    const conversationServiceStub = sinon.createStubInstance(ConversationService)
    conversationServiceStub.leave.rejects(new Error('Bad Request'))
    const conversationController = new ConversationController(conversationServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      params: {
        userId: '1',
        conversationId: '1',
      },
    } as unknown as HttpContext

    // Act
    try {
      await conversationController.delete(ctx)
    } catch (e) {
      assert.equal(e.message, 'Bad Request')
      assert.isTrue(conversationServiceStub.leave.calledOnce)
    }
  })
})
