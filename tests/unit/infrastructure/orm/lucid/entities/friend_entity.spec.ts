import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { DateTime } from 'luxon'
import { Friend } from '#domains/friends/friend_model'
import { User } from '#domains/users/user_model'
import UserEntity from '#infrastructure/orm/lucid/entities/user_entity'
import { BelongsTo } from '@adonisjs/lucid/types/relations'
import FriendEntity from '#infrastructure/orm/lucid/entities/friend_entity'

test.group('FriendEntity', () => {
  test('should convert to domain', async ({ assert }) => {
    const friendId = '1'
    const requestedBy: User = {
      userId: '1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@email.com',
      birthdate: new Date('1990-01-01'),
      emailVerified: true,
      avatar: 'avatar.png',
      role: 'user',
      overview: '',
      password: '',
      createdAt: DateTime.now().toJSDate(),
      token: 'token',
    }
    const addressedTo: User = {
      userId: '2',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@email.com',
      birthdate: new Date('1990-01-01'),
      emailVerified: true,
      avatar: 'avatar.png',
      role: 'user',
      overview: '',
      password: '',
      createdAt: DateTime.now().toJSDate(),
      token: 'token',
    }

    const createdAt = DateTime.now()

    const expected: Friend = {
      friendId: friendId,
      requestedBy: requestedBy,
      addressedTo: addressedTo,
      createdAt: createdAt.toJSDate(),
    }

    const userEntityStub = sinon.stub(UserEntity.prototype, 'toDomain')
    userEntityStub.onFirstCall().returns(requestedBy)
    userEntityStub.onSecondCall().returns(addressedTo)

    const friendEntity = new FriendEntity()
    friendEntity.friendId = expected.friendId
    friendEntity.requestedBy = requestedBy.userId
    friendEntity.addressedTo = addressedTo.userId
    friendEntity.sender = new UserEntity() as BelongsTo<typeof UserEntity>
    friendEntity.receiver = new UserEntity() as BelongsTo<typeof UserEntity>
    friendEntity.createdAt = createdAt

    const result = friendEntity.toDomain()

    assert.deepEqual(result, expected)

    userEntityStub.restore()
  })
})
