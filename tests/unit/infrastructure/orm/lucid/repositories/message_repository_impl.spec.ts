import { test } from '@japa/runner'
import * as sinon from 'sinon'
import MessageEntity from '#infrastructure/orm/lucid/entities/message_entity'
import { MessageRepositoryImpl } from '#infrastructure/orm/lucid/repositories/message_repository_impl'
import { MessageSample } from '#tests/unit/domains/utils/message_sample'
import { UserSample } from '#tests/unit/domains/utils/user_sample'
import { ConversationSample } from '#tests/unit/domains/utils/conversation_sample'

test.group('MessageRepositoryImpl', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return messages for a specific conversation', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const conversation = ConversationSample.new({ conversationId: '1' })
    const message = MessageSample.new({
      messageId: '1',
      sender: user,
      conversationId: conversation.conversationId,
    })

    const queryStub = {
      where: sinon.stub().returnsThis(),
      preload: sinon.stub().returnsThis(),
      map: sinon.stub().returns([message]),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(MessageEntity, 'query').returns(queryStub)

    const messageRepository = new MessageRepositoryImpl()
    const result = await messageRepository.getByConversation(conversation.conversationId)

    assert.deepEqual(result, [message])

    lucidStub.restore()
  })

  test('should create a new message', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const conversation = ConversationSample.new({ conversationId: '1' })
    const message = MessageSample.new({
      messageId: '1',
      sender: user,
      conversationId: conversation.conversationId,
    })

    const createStub = sinon.stub(MessageEntity, 'create').resolves(new MessageEntity())
    const toDomainStub = sinon.stub(MessageEntity.prototype, 'toDomain').returns(message)
    const queryStub = {
      where: sinon.stub().returnsThis(),
      preload: sinon.stub().returnsThis(),
      firstOrFail: sinon.stub().resolves(new MessageEntity()),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(MessageEntity, 'query').returns(queryStub)

    const messageRepository = new MessageRepositoryImpl()
    const result = await messageRepository.create(message)

    assert.deepEqual(result, message)

    createStub.restore()
    lucidStub.restore()
    toDomainStub.restore()
  })
})
