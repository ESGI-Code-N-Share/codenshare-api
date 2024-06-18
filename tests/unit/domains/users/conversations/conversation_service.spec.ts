import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { ConversationService } from '#domains/users/conversations/conversation_service'
import { UserService } from '#domains/users/user_service'
import { ConversationRepositoryImpl } from '#infrastructure/orm/lucid/repositories/conversation_repository_impl'
import { UserRepositoryImpl } from '#infrastructure/orm/lucid/repositories/user_repository_impl'
import { UserSample } from '#tests/unit/domains/utils/user_sample'
import {
  ConversationException,
  ConversationMessageException,
} from '#domains/users/conversations/conversation_exception'

test.group('ConversationService - GetByUser', (group) => {
  let conversationService: ConversationService
  let conversationRepository: ConversationRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    conversationRepository = new ConversationRepositoryImpl()
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
    conversationService = new ConversationService(conversationRepository, userService)
  })

  test('should get conversations by user', async ({ assert }) => {
    const userId = '1'
    const getByUserStub = sinon.stub(conversationRepository, 'getByUser').resolves([
      {
        conversationId: '1',
        owner: UserSample.new({ userId: '1' }),
        members: [UserSample.new({ userId: '2' }), UserSample.new({ userId: '3' })],
        messages: [],
        createdAt: new Date(),
      },
      {
        conversationId: '2',
        owner: UserSample.new({ userId: '2' }),
        members: [UserSample.new({ userId: '1' }), UserSample.new({ userId: '3' })],
        messages: [],
        createdAt: new Date(),
      },
    ])

    const conversations = await conversationService.getByUser(userId)

    assert.exists(conversations)
    assert.equal(conversations.length, 2)
    assert.isTrue(getByUserStub.calledOnce)

    getByUserStub.restore()
  })

  test('should return an empty array when no conversations are found', async ({ assert }) => {
    const userId = '1'
    const getByUserStub = sinon.stub(conversationRepository, 'getByUser').resolves([])

    const conversations = await conversationService.getByUser(userId)

    assert.exists(conversations)
    assert.equal(conversations.length, 0)
    assert.isTrue(getByUserStub.calledOnce)

    getByUserStub.restore()
  })
})

test.group('ConversationService - GetById', (group) => {
  let conversationService: ConversationService
  let conversationRepository: ConversationRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    conversationRepository = new ConversationRepositoryImpl()
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
    conversationService = new ConversationService(conversationRepository, userService)
  })

  test('should get conversation by id', async ({ assert }) => {
    const conversationId = '1'
    const getByIdStub = sinon.stub(conversationRepository, 'getById').resolves({
      conversationId: '1',
      owner: UserSample.new({ userId: '1' }),
      members: [UserSample.new({ userId: '2' }), UserSample.new({ userId: '3' })],
      messages: [],
      createdAt: new Date(),
    })

    const conversation = await conversationService.getById(conversationId)

    assert.exists(conversation)
    assert.equal(conversation.conversationId, conversationId)
    assert.isTrue(getByIdStub.calledOnce)

    getByIdStub.restore()
  })

  test('should throw ConversationException when conversation is not found', async ({ assert }) => {
    const conversationId = '1'
    const getByIdStub = sinon
      .stub(conversationRepository, 'getById')
      .rejects(new ConversationException(ConversationMessageException.CONVERSATION_NOT_FOUND))

    try {
      await conversationService.getById(conversationId)
      assert.fail('Should have thrown an exception')
    } catch (error) {
      assert.equal(error.message, ConversationMessageException.CONVERSATION_NOT_FOUND)
    }

    assert.isTrue(getByIdStub.calledOnce)

    getByIdStub.restore()
  })
})

test.group('ConversationService - Create', (group) => {
  let conversationService: ConversationService
  let conversationRepository: ConversationRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    conversationRepository = new ConversationRepositoryImpl()
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
    conversationService = new ConversationService(conversationRepository, userService)
  })

  test('should create a conversation with 1 member', async ({ assert }) => {
    const ownerId = '1'
    const members = [UserSample.new({ userId: '2' })]
    const createConversationDto = { ownerId, memberIds: members.map((m) => m.userId) }
    const getByIdStub = sinon
      .stub(userService, 'getById')
      .resolves(UserSample.new({ userId: ownerId }))
      .onFirstCall()
      .resolves(UserSample.new({ userId: members[0].userId }))
    const createStub = sinon.stub(conversationRepository, 'create').resolves({
      conversationId: '1',
      owner: UserSample.new({ userId: ownerId }),
      members: members,
      messages: [],
      createdAt: new Date(),
    })

    const conversation = await conversationService.create(createConversationDto)

    assert.exists(conversation)
    assert.equal(conversation.owner.userId, ownerId)
    assert.deepEqual(conversation.members, members)
    assert.deepEqual(conversation.messages, [])
    assert.isTrue(getByIdStub.calledTwice)
    assert.isTrue(createStub.calledOnce)

    getByIdStub.restore()
    createStub.restore()
  })

  test('should create a conversation with 2 members', async ({ assert }) => {
    const ownerId = '1'
    const members = [UserSample.new({ userId: '2' }), UserSample.new({ userId: '3' })]
    const createConversationDto = { ownerId, memberIds: members.map((m) => m.userId) }
    const getByIdStub = sinon
      .stub(userService, 'getById')
      .resolves(UserSample.new({ userId: ownerId }))
      .onFirstCall()
      .resolves(UserSample.new({ userId: members[0].userId }))
      .onSecondCall()
      .resolves(UserSample.new({ userId: members[1].userId }))
    const createStub = sinon.stub(conversationRepository, 'create').resolves({
      conversationId: '1',
      owner: UserSample.new({ userId: ownerId }),
      members: members,
      messages: [],
      createdAt: new Date(),
    })

    const conversation = await conversationService.create(createConversationDto)

    assert.exists(conversation)
    assert.equal(conversation.owner.userId, ownerId)
    assert.deepEqual(conversation.members, members)
    assert.deepEqual(conversation.messages, [])
    assert.isTrue(getByIdStub.calledThrice)
    assert.isTrue(createStub.calledOnce)

    getByIdStub.restore()
    createStub.restore()
  })

  test('should throw ConversationException when there is only 1 participant', async ({
    assert,
  }) => {
    const ownerId = '1'
    const members = [UserSample.new({ userId: '1' })]
    const createConversationDto = { ownerId, memberIds: members.map((m) => m.userId) }
    const getByIdStub = sinon
      .stub(userService, 'getById')
      .resolves(UserSample.new({ userId: ownerId }))

    try {
      await conversationService.create(createConversationDto)
      assert.fail('Should have thrown an exception')
    } catch (error) {
      assert.equal(error.message, ConversationMessageException.AT_LEAST_TWO_PARTICIPANTS)
    }

    assert.isTrue(getByIdStub.calledTwice)

    getByIdStub.restore()
  })
})

test.group('ConversationService - Leave', (group) => {
  let conversationService: ConversationService
  let conversationRepository: ConversationRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    conversationRepository = new ConversationRepositoryImpl()
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
    conversationService = new ConversationService(conversationRepository, userService)
  })

  test('should leave a conversation as a member', async ({ assert }) => {
    const conversationId = '1'
    const userId = '2'
    const getByIdStub = sinon.stub(conversationRepository, 'getById').resolves({
      conversationId: conversationId,
      owner: UserSample.new({ userId: '1' }),
      members: [UserSample.new({ userId: '2' }), UserSample.new({ userId: '3' })],
      messages: [],
      createdAt: new Date(),
    })
    const removeUserStub = sinon.stub(conversationRepository, 'removeUser').resolves('1')

    const result = await conversationService.leave({ conversationId, userId })

    assert.equal(result, conversationId)
    assert.isTrue(getByIdStub.calledOnce)
    assert.isTrue(removeUserStub.calledOnce)

    getByIdStub.restore()
    removeUserStub.restore()
  })

  test('should delete a conversation as the owner', async ({ assert }) => {
    const conversationId = '1'
    const userId = '1'
    const getByIdStub = sinon.stub(conversationRepository, 'getById').resolves({
      conversationId: conversationId,
      owner: UserSample.new({ userId: '1' }),
      members: [UserSample.new({ userId: '2' }), UserSample.new({ userId: '3' })],
      messages: [],
      createdAt: new Date(),
    })
    const deleteStub = sinon.stub(conversationRepository, 'delete').resolves(conversationId)

    const result = await conversationService.leave({ conversationId, userId })

    assert.equal(result, conversationId)
    assert.isTrue(getByIdStub.calledOnce)
    assert.isTrue(deleteStub.calledOnce)

    getByIdStub.restore()
    deleteStub.restore()
  })

  test('should throw ConversationException when conversation is not found', async ({ assert }) => {
    const conversationId = '1'
    const userId = '1'
    const getByIdStub = sinon
      .stub(conversationRepository, 'getById')
      .rejects(new ConversationException(ConversationMessageException.CONVERSATION_NOT_FOUND))

    try {
      await conversationService.leave({ conversationId, userId })
      assert.fail('Should have thrown an exception')
    } catch (error) {
      assert.equal(error.message, ConversationMessageException.CONVERSATION_NOT_FOUND)
    }

    assert.isTrue(getByIdStub.calledOnce)

    getByIdStub.restore()
  })
})
