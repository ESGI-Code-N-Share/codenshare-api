import { type UserRepositoryPort } from '#domains/users/user_repository'
import UserEntity from '../entities/user_entity.js'
import { User, type UserId } from '#domains/users/user_model'
import { DateTime } from 'luxon'
import { UpdateUserDto } from "#domains/users/user_dto";

export class UserRepositoryImpl implements UserRepositoryPort {
  async searchByEmail(query: string): Promise<User[]> {
    const users = await UserEntity.query()
      .where('email', 'ILIKE', `%${query}%`)
      .whereNull('deleted_at')
      .exec()
    return users.map((user) => user.toDomain())
  }

  async searchByFirstnameOrLastname(query: string): Promise<User[]> {
    const users = await UserEntity.query()
      .where('firstname', 'ILIKE', `%${query}%`)
      .orWhere('lastname', 'ILIKE', `%${query}%`)
      .whereNull('deleted_at')
      .exec()
    return users.map((user) => user.toDomain())
  }

  async getById(userId: UserId): Promise<User> {
    const user = await UserEntity.query()
      .where('user_id', userId)
      .whereNull('deleted_at')
      .firstOrFail()
    return user.toDomain()
  }

  async delete(userId: UserId): Promise<void> {
    const user = await UserEntity.findOrFail(userId)
    await user.delete()
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await UserEntity.query().where('email', email).whereNull('deleted_at').first()
    return user ? user.toDomain() : null
  }

  async create(user: User): Promise<User> {
    const userEntity = await UserEntity.create({
      userId: user.userId,
      email: user.email,
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate,
      avatar: user.avatar,
    })
    return userEntity.toDomain()
  }

  async update(user: User): Promise<User> {
    const userEntity = await UserEntity.findOrFail(user.userId)

    userEntity.email = user.email
    userEntity.password = user.password
    userEntity.firstname = user.firstname
    userEntity.lastname = user.lastname
    userEntity.birthdate = user.birthdate
    userEntity.avatar = user.avatar
    userEntity.overview = user.overview
    userEntity.role = user.role
    userEntity.token = user.token
    userEntity.updatedAt = DateTime.now()
    userEntity.emailVerified = user.emailVerified

    await userEntity.save()
    return userEntity.toDomain()
  }

  async updatePartial(userId: UserId, updateUserDto: UpdateUserDto): Promise<User> {
    const userEntity = await UserEntity.findOrFail(userId)

    userEntity.firstname = updateUserDto.firstname
    userEntity.lastname = updateUserDto.lastname
    userEntity.overview = updateUserDto.overview || userEntity.overview
    userEntity.updatedAt = DateTime.now()

    await userEntity.save()
    return userEntity.toDomain()
  }
}
