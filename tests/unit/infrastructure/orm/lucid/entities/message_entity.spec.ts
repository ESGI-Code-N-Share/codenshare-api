import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { DateTime } from 'luxon'
import MessageEntity from '#infrastructure/orm/lucid/entities/message_entity'
import { Message } from '#domains/users/conversations/messages/message_model'
import UserEntity from '#infrastructure/orm/lucid/entities/user_entity'
import { User } from '#domains/users/user_model'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

test.group('MessageEntity', () => {
  test('should convert to domain', async ({ assert }) => {
    const sendAt = DateTime.now()
    const sender: User = {
      userId: '1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@email.com',
      birthdate: new Date('1990-01-01'),
      avatar: 'avatar.png',
      emailVerified: true,
      role: 'user',
      overview: '',
      password: '',
      createdAt: DateTime.now().toJSDate(),
      token: 'token',
    }
    const expected: Message = {
      messageId: '1',
      content: 'Hello, World!',
      sender: sender,
      image: undefined,
      conversationId: '1',
      sendAt: sendAt.toJSDate(),
    }

    const userEntityStub = sinon.stub(UserEntity.prototype, 'toDomain').returns(sender)

    const messageEntity = new MessageEntity()
    messageEntity.messageId = expected.messageId
    messageEntity.content = expected.content
    messageEntity.senderId = expected.sender.userId
    messageEntity.sender = new UserEntity() as BelongsTo<typeof UserEntity>
    messageEntity.conversationId = expected.conversationId
    messageEntity.sendAt = sendAt

    const result = messageEntity.toDomain()

    assert.deepEqual(result, expected)

    userEntityStub.restore()
  })
})
