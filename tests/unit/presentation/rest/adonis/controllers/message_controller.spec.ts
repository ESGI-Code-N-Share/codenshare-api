import { test } from '@japa/runner'
import sinon from 'sinon'
import MessageController from '#presentation/rest/adonis/controllers/message_controller'
import { MessageService } from '#domains/users/conversations/messages/message_service'
import { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import { MessageSample } from '#tests/unit/domains/utils/message_sample'

test.group('MessageController - getByConversation', () => {
  test('should get messages by conversation', async ({ assert }) => {
    // Arrange
    const messageServiceStub = sinon.createStubInstance(MessageService)
    messageServiceStub.getByConversation.resolves([])
    const messageController = new MessageController(messageServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        json: sinon.fake(),
      },
      params: {
        conversationId: randomUUID(),
      },
    } as unknown as HttpContext

    // Act
    await messageController.getByConversation(ctx)

    // Assert
    assert.isTrue(messageServiceStub.getByConversation.calledOnce)
  })

  test('should return error 500 if something goes wrong', async ({ assert }) => {
    // Arrange
    const messageServiceStub = sinon.createStubInstance(MessageService)
    messageServiceStub.getByConversation.rejects(new Error('Internal Server Error'))
    const messageController = new MessageController(messageServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      params: {
        conversationId: '1',
      },
    } as unknown as HttpContext

    // Act
    try {
      await messageController.getByConversation(ctx)
    } catch (e) {
      assert.equal(e.message, 'Internal Server Error')
      assert.isTrue(messageServiceStub.getByConversation.calledOnce)
    }
  })
})

test.group('MessageController - Send', () => {
  test('should send a message', async ({ assert }) => {
    // Arrange
    const messageServiceStub = sinon.createStubInstance(MessageService)
    messageServiceStub.send.resolves(MessageSample.new({}))
    const messageController = new MessageController(messageServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        json: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({ content: 'Test message', userId: randomUUID() }),
      },
      params: {
        conversationId: randomUUID(),
      },
    } as unknown as HttpContext

    // Act
    await messageController.send(ctx)

    // Assert
    assert.isTrue(messageServiceStub.send.calledOnce)
  })

  test('should return error 500 if something goes wrong', async ({ assert }) => {
    // Arrange
    const messageServiceStub = sinon.createStubInstance(MessageService)
    messageServiceStub.send.rejects(new Error('Internal Server Error'))
    const messageController = new MessageController(messageServiceStub as any)

    const ctx = {
      response: {
        status: sinon.stub().returnsThis(),
        send: sinon.fake(),
      },
      request: {
        all: sinon.fake.returns({ content: 'Test message', userId: '1' }),
      },
      params: {
        conversationId: '1',
      },
    } as unknown as HttpContext

    // Act
    try {
      await messageController.send(ctx)
    } catch (e) {
      assert.equal(e.message, 'Internal Server Error')
      assert.isTrue(messageServiceStub.send.calledOnce)
    }
  })
})
