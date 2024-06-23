import { test } from '@japa/runner'
import { Message } from '#domains/users/conversations/messages/message_model'
import { UserSample } from '#tests/unit/domains/utils/user_sample'

test.group('Message Model', () => {
  test('should create a new message', ({ assert }) => {
    const userId = '1'
    const message = Message.new('Hello, World!', UserSample.new({ userId }), '1')

    assert.exists(message.messageId)
    assert.equal(message.conversationId, '1')
    assert.equal(message.sender.userId, userId)
    assert.equal(message.content, 'Hello, World!')
    assert.equal(message.image, undefined)
    assert.exists(message.sendAt)
  })

  test('should create a message from persistence data', ({ assert }) => {
    const expected = {
      messageId: '12345',
      content: 'Hello, World!',
      conversationId: '1',
      sender: UserSample.new({ userId: '1' }),
      sendAt: new Date(),
    }
    const messageData = {
      messageId: '12345',
      content: 'Hello, World!',
      conversationId: '1',
      sender: UserSample.new({ userId: expected.sender.userId }),
      sendAt: new Date(),
    }

    const message = Message.fromPersistence(messageData)

    assert.equal(message.messageId, expected.messageId)
    assert.equal(message.conversationId, expected.conversationId)
    assert.equal(message.sender.userId, expected.sender.userId)
    assert.equal(message.content, expected.content)
    assert.equal(message.image, undefined)
    assert.equal(message.sendAt.toISOString(), expected.sendAt.toISOString())
  })
})
