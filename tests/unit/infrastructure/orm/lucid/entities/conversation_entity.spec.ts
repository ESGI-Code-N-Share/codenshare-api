import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { DateTime } from 'luxon'
import { User } from '#domains/users/user_model'
import { Message } from '#domains/users/conversations/messages/message_model'
import UserEntity from '#infrastructure/orm/lucid/entities/user_entity'
import ConversationEntity from '#infrastructure/orm/lucid/entities/conversation_entity'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import MessageEntity from '#infrastructure/orm/lucid/entities/message_entity'

test.group('ConversationEntity', () => {
  test('should convert to domain', async ({ assert }) => {
    const conversationId = '1'
    const createdAt = DateTime.now()
    const owner: User = {
      userId: '1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@email.com',
      birthdate: new Date('1990-01-01'),
      avatar: 'avatar.png',
      role: 'user',
      emailVerified: true,
      overview: '',
      password: '',
      createdAt: DateTime.now().toJSDate(),
      token: 'token',
    }
    const members: User[] = [
      {
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
      },
    ]
    const messages: Message[] = [
      {
        messageId: '1',
        content: 'Hello, World!',
        sender: owner,
        image: undefined,
        conversationId: conversationId,
        sendAt: createdAt.toJSDate(),
      },
    ]

    const expected = {
      conversationId: '1',
      owner: owner,
      members: members,
      messages: messages,
      createdAt: createdAt.toJSDate(),
    }

    const userEntityStub = sinon
      .stub(UserEntity.prototype, 'toDomain')
      .onFirstCall()
      .returns(owner)
      .onSecondCall()
      .returns(members[0])
    const messageEntityStub = sinon.stub(MessageEntity.prototype, 'toDomain').returns(messages[0])

    const conversationEntity = new ConversationEntity()
    conversationEntity.conversationId = expected.conversationId
    conversationEntity.ownerId = expected.owner.userId
    conversationEntity.owner = new UserEntity() as BelongsTo<typeof UserEntity>
    conversationEntity.participants = [new UserEntity()] as ManyToMany<typeof UserEntity>
    conversationEntity.messages = [new MessageEntity()] as HasMany<typeof MessageEntity>
    conversationEntity.createdAt = createdAt

    const result = conversationEntity.toDomain()

    assert.deepEqual(result, expected)

    userEntityStub.restore()
    messageEntityStub.restore()
  })
})
