import { User } from '#domains/users/user_model'

export class UserSample {
  static new(userData: Partial<User>): User {
    return {
      userId: userData.userId ?? '1',
      email: userData.email ?? 'jhon.doe@email.com',
      emailVerified: true,
      firstname: userData.firstname ?? 'Jhon',
      lastname: userData.lastname ?? 'Doe',
      birthdate: userData.birthdate ?? new Date('1990-01-01'),
      avatar: userData.avatar ?? 'avatar.png',
      role: userData.role ?? 'user',
      password: userData.password ?? '',
      createdAt: userData.createdAt ?? new Date(),
    }
  }
}
