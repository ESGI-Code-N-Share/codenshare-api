import { test } from '@japa/runner'
import { User } from '#domains/users/user_model'

test.group('User Model', () => {
  test('should create a new user', ({ assert }) => {
    const firstname = 'John'
    const lastname = 'Doe'
    const email = 'john.doe@example.com'
    const birthdate = new Date('1990-01-01')
    const avatar = 'avatar.png'
    const password = 'password123'
    const role = 'user'

    const user = User.new(firstname, lastname, email, birthdate, password, avatar, true, role)

    assert.exists(user.userId)
    assert.equal(user.firstname, firstname)
    assert.equal(user.lastname, lastname)
    assert.equal(user.email, email)
    assert.equal(user.birthdate.toISOString(), birthdate.toISOString())
    assert.equal(user.avatar, avatar)
    assert.equal(user.role, role)
    assert.equal(user.password, password)
    assert.exists(user.createdAt)
  })

  test('should create a user from persistence data', ({ assert }) => {
    const data = {
      userId: '12345',
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane.doe@example.com',
      birthdate: new Date('1995-05-15'),
      avatar: 'avatar2.png',
      emailVerified: true,
      role: 'admin' as const,
      password: 'password456',
      createdAt: new Date('2022-01-01'),
      token: 'sometoken',
      overview: 'This is a test overview',
    }

    const user = User.fromPersistence(data)

    assert.equal(user.userId, data.userId)
    assert.equal(user.firstname, data.firstname)
    assert.equal(user.lastname, data.lastname)
    assert.equal(user.email, data.email)
    assert.equal(user.birthdate.toISOString(), data.birthdate.toISOString())
    assert.equal(user.avatar, data.avatar)
    assert.equal(user.role, data.role)
    assert.equal(user.password, data.password)
    assert.equal(user.createdAt.toISOString(), data.createdAt.toISOString())
    assert.equal(user.token, data.token)
    assert.equal(user.overview, data.overview)
  })
})
