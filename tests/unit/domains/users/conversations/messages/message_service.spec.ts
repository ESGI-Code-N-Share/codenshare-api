import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { MessageService } from '#domains/users/conversations/messages/message_service'
import { MessageRepositoryImpl } from '#infrastructure/orm/lucid/repositories/message_repository_impl'
import { ConversationService } from '#domains/users/conversations/conversation_service'
import { ConversationRepositoryImpl } from '#infrastructure/orm/lucid/repositories/conversation_repository_impl'
import { UserService } from '#domains/users/user_service'
import { UserRepositoryImpl } from '#infrastructure/orm/lucid/repositories/user_repository_impl'
import { Message } from '#domains/users/conversations/messages/message_model'
import { UserSample } from '#tests/unit/domains/utils/user_sample'
import {
  ConversationException,
  ConversationMessageException,
} from '#domains/users/conversations/conversation_exception'
import { Conversation } from '#domains/users/conversations/conversation_model'

test.group('MessageService - GetByConversation', (group) => {
  let messageService: MessageService
  let messageRepository: MessageRepositoryImpl
  let conversationService: ConversationService
  let conversationRepository: ConversationRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    messageRepository = new MessageRepositoryImpl()
    conversationRepository = new ConversationRepositoryImpl()
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
    conversationService = new ConversationService(conversationRepository, userService)
    messageService = new MessageService(messageRepository, conversationService, userService)
  })

  test('should get messages by conversation', async ({ assert }) => {
    const conversationId = '1'
    const messages: Message[] = [
      Message.new('Hello, World!', UserSample.new({ userId: '1' }), conversationId),
      Message.new('Hi, World!', UserSample.new({ userId: '1' }), conversationId),
    ]
    const getByConversationStub = sinon
      .stub(messageRepository, 'getByConversation')
      .resolves(messages)

    const result = await messageService.getByConversation(conversationId)

    assert.deepEqual(result, messages)
    assert.isTrue(getByConversationStub.calledOnce)

    getByConversationStub.restore()
  })

  test('should get an empty array if no messages found', async ({ assert }) => {
    const conversationId = 'NOT_FOUND'
    const getByConversationStub = sinon.stub(messageRepository, 'getByConversation').resolves([])

    const result = await messageService.getByConversation(conversationId)

    assert.deepEqual(result, [])
    assert.isTrue(getByConversationStub.calledOnce)

    getByConversationStub.restore()
  })

  test('should throw an error if conversation not found', async ({ assert }) => {
    const conversationId = 'NOT_FOUND'
    const getByConversationStub = sinon
      .stub(messageRepository, 'getByConversation')
      .rejects(new ConversationException(ConversationMessageException.CONVERSATION_NOT_FOUND))

    try {
      await messageService.getByConversation(conversationId)
      assert.fail('Should throw an exception')
    } catch (e) {
      assert.equal(e.message, ConversationMessageException.CONVERSATION_NOT_FOUND)
    }

    getByConversationStub.restore()
  })
})

test.group('MessageService - Send', (group) => {
  let messageService: MessageService
  let messageRepository: MessageRepositoryImpl
  let conversationService: ConversationService
  let conversationRepository: ConversationRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    messageRepository = new MessageRepositoryImpl()
    conversationRepository = new ConversationRepositoryImpl()
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
    conversationService = new ConversationService(conversationRepository, userService)
    messageService = new MessageService(messageRepository, conversationService, userService)
  })

  test('should send a message to a conversation', async ({ assert }) => {
    const messageDto = {
      conversationId: '1',
      senderId: '1',
      content: 'Hello, World!',
    }
    const sender = UserSample.new({ userId: messageDto.senderId })
    const members = [UserSample.new({ userId: '2' }), UserSample.new({ userId: '3' })]
    const conversation: Conversation = Conversation.new(sender, members)
    const expected = Message.new(messageDto.content, sender, conversation.conversationId)
    const getByIdStub = sinon.stub(userService, 'getById').resolves(sender)
    const getByIdConversationStub = sinon
      .stub(conversationService, 'getById')
      .resolves(conversation)
    const createStub = sinon.stub(messageRepository, 'create').resolves(expected)

    const result = await messageService.send(messageDto)

    assert.deepEqual(result, expected)
    assert.isTrue(getByIdStub.calledOnce)
    assert.isTrue(getByIdConversationStub.calledOnce)
    assert.isTrue(createStub.calledOnce)

    getByIdStub.restore()
    getByIdConversationStub.restore()
    createStub.restore()
  })

  test('should throw an error if sender not found', async ({ assert }) => {
    const messageDto = {
      conversationId: '1',
      senderId: 'NOT_FOUND',
      content: 'Hello, World!',
    }
    const getByIdStub = sinon
      .stub(userService, 'getById')
      .rejects(new ConversationException(ConversationMessageException.CONVERSATION_NOT_FOUND))

    try {
      await messageService.send(messageDto)
      assert.fail('Should throw an exception')
    } catch (e) {
      assert.equal(e.message, ConversationMessageException.CONVERSATION_NOT_FOUND)
    }

    getByIdStub.restore()
  })

  test('should throw an error if conversation not found', async ({ assert }) => {
    const messageDto = {
      conversationId: 'NOT_FOUND',
      senderId: '1',
      content: 'Hello, World!',
    }
    const sender = UserSample.new({ userId: messageDto.senderId })
    const getByIdStub = sinon.stub(userService, 'getById').resolves(sender)
    const getByIdConversationStub = sinon
      .stub(conversationService, 'getById')
      .rejects(new ConversationException(ConversationMessageException.CONVERSATION_NOT_FOUND))

    try {
      await messageService.send(messageDto)
      assert.fail('Should throw an exception')
    } catch (e) {
      assert.equal(e.message, ConversationMessageException.CONVERSATION_NOT_FOUND)
    }

    getByIdStub.restore()
    getByIdConversationStub.restore()
  })
})
