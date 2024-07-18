import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { UserService } from '#domains/users/user_service'
import { UserRepositoryImpl } from '#infrastructure/orm/lucid/repositories/user_repository_impl'
import { UserException, UserMessageException } from '#domains/users/user_exception'
import { UserSample } from '#tests/unit/domains/utils/user_sample'

test.group('UserService - Constructor', (group) => {
  let userRepository: sinon.SinonStubbedInstance<UserRepositoryImpl>

  group.each.setup(() => {
    userRepository = sinon.createStubInstance(UserRepositoryImpl)
  })

  test('should create an instance of UserService with UserRepositoryImpl', ({ assert }) => {
    const userService = new UserService(userRepository)

    assert.exists(userService)
    assert.instanceOf(userService, UserService)
    assert.exists(userService['userRepository'])
    assert.instanceOf(userService['userRepository'], UserRepositoryImpl)
  })
})

test.group('UserService - GetById', (group) => {
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
  })

  test('should get a user by id if user exist', async ({ assert }) => {
    const userId = '2'
    const expected = '1'
    const getByIdStub = sinon
      .stub(userRepository, 'getById')
      .resolves(UserSample.new({ userId: userId }))

    const user = await userService.getById(userId)

    assert.exists(user)
    assert.equal(user.userId, expected)
    assert.isTrue(getByIdStub.calledOnce)

    getByIdStub.restore()
  })

  test('should throw UserException if user not exist', async ({ assert }) => {
    const userId = 'NOT_FOUND'
    const getByIdStub = sinon
      .stub(userRepository, 'getById')
      .rejects(new UserException(UserMessageException.USER_NOT_FOUND))

    try {
      await userService.getById(userId)
      assert.fail('Should throw an exception')
    } catch (e) {
      assert.equal(e.message, UserMessageException.USER_NOT_FOUND)
    }

    getByIdStub.restore()
  })
})

test.group('UserService - Delete', (group) => {
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
  })

  test('should delete a user by id if user exist', async ({ assert }) => {
    const userId = '1'
    const deletedStub = sinon.stub(userRepository, 'delete').resolves()
    const getByIdStub = sinon
      .stub(userService, 'getById')
      .resolves(UserSample.new({ userId: userId }))

    await userService.delete(userId)

    assert.isTrue(getByIdStub.calledOnce)
    assert.isTrue(deletedStub.calledOnce)
    assert.isTrue(deletedStub.calledWith(userId))

    deletedStub.restore()
    getByIdStub.restore()
  })

  test('should throw UserException if user not exist', async ({ assert }) => {
    const userId = 'NOT_FOUND'
    const deletedStub = sinon.stub(userRepository, 'getById').rejects(new Error())

    try {
      await userService.delete(userId)
      assert.fail('Should throw an exception')
    } catch (e) {
      assert.equal(e.message, UserMessageException.USER_NOT_FOUND)
    }

    deletedStub.restore()
  })
})

test.group('UserService - Search', (group) => {
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
  })

  test('should find unique users by email or firstname/lastname', async ({ assert }) => {
    const query = 'john'
    const searchByEmailStub = sinon.stub(userRepository, 'searchByEmail').resolves([
      {
        userId: '1',
        avatar: '',
        birthdate: new Date(),
        createdAt: new Date(),
        email: 'john.doe@email.com',
        emailVerified: true,
        firstname: 'John',
        lastname: 'some',
        password: '',
        role: 'user',
      },
    ])
    const searchByFirstnameOrLastnameStub = sinon
      .stub(userRepository, 'searchByFirstnameOrLastname')
      .resolves([
        {
          userId: '2',
          avatar: 'some',
          birthdate: new Date(),
          createdAt: new Date(),
          email: 'other@email.com',
          firstname: 'John',
          lastname: '',
          emailVerified: true,
          password: '',
          role: 'user',
        },
        {
          userId: '1',
          avatar: '',
          birthdate: new Date(),
          emailVerified: true,
          createdAt: new Date(),
          email: 'another@email.com',
          firstname: 'John',
          lastname: 'some',
          password: '',
          role: 'user',
        },
      ])

    const users = await userService.search({ query })

    assert.equal(users.length, 2)
    assert.isTrue(searchByEmailStub.calledOnce)
    assert.isTrue(searchByFirstnameOrLastnameStub.calledOnce)

    searchByEmailStub.restore()
    searchByFirstnameOrLastnameStub.restore()
  })

  test('should return empty array if no users found', async ({ assert }) => {
    const query = 'john'
    const searchByEmailStub = sinon.stub(userRepository, 'searchByEmail').resolves([])
    const searchByFirstnameOrLastnameStub = sinon
      .stub(userRepository, 'searchByFirstnameOrLastname')
      .resolves([])

    const users = await userService.search({ query })

    assert.equal(users.length, 0)
    assert.isTrue(searchByEmailStub.calledOnce)
    assert.isTrue(searchByFirstnameOrLastnameStub.calledOnce)

    searchByEmailStub.restore()
    searchByFirstnameOrLastnameStub.restore()
  })
})
