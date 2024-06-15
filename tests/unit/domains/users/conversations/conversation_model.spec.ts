import { test } from '@japa/runner'
import { Conversation } from '#domains/users/conversations/conversation_model'
import { UserSample } from '#tests/unit/domains/utils/user_sample'

test.group('Conversation Model', () => {
  test('should create a new conversation', ({ assert }) => {
    const owner = UserSample.new({ userId: '1' })
    const members = [UserSample.new({ userId: '2' }), UserSample.new({ userId: '3' })]
    const conversation = Conversation.new(owner, members)

    assert.exists(conversation.conversationId)
    assert.equal(conversation.owner, owner)
    assert.equal(conversation.members, members)
    assert.deepEqual(conversation.messages, [])
    assert.exists(conversation.createdAt)
  })

  test('should create a conversation from persistence data', ({ assert }) => {
    const owner = UserSample.new({ userId: '1' })
    const members = [UserSample.new({ userId: '2' }), UserSample.new({ userId: '3' })]
    const conversationData = {
      conversationId: '12345',
      owner: owner,
      members: members,
      messages: [],
      createdAt: new Date('2022-01-01'),
    }

    const conversation = Conversation.fromPersistence(conversationData)

    assert.equal(conversation.conversationId, conversationData.conversationId)
    assert.equal(conversation.owner, conversationData.owner)
    assert.equal(conversation.members, conversationData.members)
    assert.deepEqual(conversation.messages, conversationData.messages)
    assert.equal(conversation.createdAt.toISOString(), conversationData.createdAt.toISOString())
  })
})
