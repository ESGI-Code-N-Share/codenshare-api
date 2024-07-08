import { test } from '@japa/runner'
import { User } from '#domains/users/user_model'
import UserEntity from '#infrastructure/orm/lucid/entities/user_entity'
import { DateTime } from 'luxon'

test.group('UserEntity', () => {
  test('should convert to domain ', ({ assert }) => {
    const createdAt = DateTime.fromISO('2024-06-16T18:53:10.226Z')
    const expected: User = {
      userId: '1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@email.com',
      birthdate: new Date('1990-01-01'),
      avatar: 'avatar.png',
      role: 'user',
      overview: '',
      password: '',
      createdAt: createdAt.toJSDate(),
      token: 'token',
    }

    const userEntity = new UserEntity()
    userEntity.userId = expected.userId
    userEntity.firstname = expected.firstname
    userEntity.lastname = expected.lastname
    userEntity.email = expected.email
    userEntity.overview = expected.overview
    userEntity.birthdate = expected.birthdate
    userEntity.avatar = expected.avatar
    userEntity.role = expected.role
    userEntity.password = expected.password
    userEntity.createdAt = createdAt
    userEntity.token = expected.token

    const result = userEntity.toDomain()

    assert.equal(result.userId, expected.userId)
    assert.equal(result.firstname, expected.firstname)
    assert.equal(result.lastname, expected.lastname)
    assert.equal(result.email, expected.email)
    assert.equal(result.overview, expected.overview)
    assert.equal(result.avatar, expected.avatar)
    assert.equal(result.role, expected.role)
    assert.equal(result.password, expected.password)
    assert.equal(result.token, expected.token)
  })
})
