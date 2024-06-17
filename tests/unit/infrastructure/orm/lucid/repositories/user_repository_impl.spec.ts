import { test } from '@japa/runner'
import * as sinon from 'sinon'
import UserEntity from '#infrastructure/orm/lucid/entities/user_entity'
import { UserRepositoryImpl } from '#infrastructure/orm/lucid/repositories/user_repository_impl'
import { UserSample } from '#tests/unit/domains/utils/user_sample'

test.group('UserRepositoryImpl - GetById', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return user when user exists', async ({ assert }) => {
    const userId = '1'
    const user = UserSample.new({ userId })

    const userToDomainStub = sinon.stub(UserEntity.prototype, 'toDomain').returns(user)
    const queryStub = {
      where: sinon.stub().returnsThis(),
      whereNull: sinon.stub().returnsThis(),
      firstOrFail: sinon.stub().resolves(new UserEntity()),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(UserEntity, 'query').returns(queryStub)

    const userRepository = new UserRepositoryImpl()
    const result = await userRepository.getById(userId)

    assert.deepEqual(result, user)

    lucidStub.restore()
    userToDomainStub.restore()
  })

  test('should throw error when user does not exist', async ({ assert }) => {
    const userId = '1'

    const queryStub = {
      where: sinon.stub().returnsThis(),
      whereNull: sinon.stub().returnsThis(),
      firstOrFail: sinon.stub().rejects(new Error('User not found')),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(UserEntity, 'query').returns(queryStub)

    const userRepository = new UserRepositoryImpl()
    try {
      await userRepository.getById(userId)
    } catch (e) {
      assert.exists(e.message)
    }
  })
})

test.group('UserRepositoryImpl - SearchByEmail', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return users when users exist', async ({ assert }) => {
    const emailQuery = 'test@test.com'
    const user = UserSample.new({ email: emailQuery })

    const userToDomainStub = sinon.stub(UserEntity.prototype, 'toDomain').returns(user)
    const queryStub = {
      where: sinon.stub().returnsThis(),
      whereNull: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves([new UserEntity()]),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(UserEntity, 'query').returns(queryStub)

    const userRepository = new UserRepositoryImpl()
    const result = await userRepository.searchByEmail(emailQuery)

    assert.deepEqual(result, [user])

    lucidStub.restore()
    userToDomainStub.restore()
  })
})

test.group('UserRepositoryImpl - SearchByFirstnameOrLastname', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return users when users exist', async ({ assert }) => {
    const nameQuery = 'John'
    const user = UserSample.new({ firstname: nameQuery, lastname: nameQuery })

    const userToDomainStub = sinon.stub(UserEntity.prototype, 'toDomain').returns(user)
    const queryStub = {
      where: sinon.stub().returnsThis(),
      orWhere: sinon.stub().returnsThis(),
      whereNull: sinon.stub().returnsThis(),
      exec: sinon.stub().resolves([new UserEntity()]),
    }

    // @ts-ignore
    const lucidStub = sinon.stub(UserEntity, 'query').returns(queryStub)

    const userRepository = new UserRepositoryImpl()
    const result = await userRepository.searchByFirstnameOrLastname(nameQuery)

    assert.deepEqual(result, [user])

    lucidStub.restore()
    userToDomainStub.restore()
  })
})

test.group('UserRepositoryImpl - Delete', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should delete user when user exists', async ({ assert }) => {
    const userId = '1'
    const userEntity = new UserEntity()

    const deleteStub = sinon.stub(userEntity, 'delete').resolves()
    const findOrFailStub = sinon.stub(UserEntity, 'findOrFail').resolves(userEntity)

    const userRepository = new UserRepositoryImpl()
    await userRepository.delete(userId)

    assert.isTrue(deleteStub.calledOnce)

    findOrFailStub.restore()
    deleteStub.restore()
  })

  test('should throw error when user does not exist', async ({ assert }) => {
    const userId = '1'

    const findOrFailStub = sinon.stub(UserEntity, 'findOrFail').rejects(new Error('User not found'))

    const userRepository = new UserRepositoryImpl()
    try {
      await userRepository.delete(userId)
    } catch (e) {
      assert.exists(e.message)
    }

    findOrFailStub.restore()
  })
})
