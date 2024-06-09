import { type UserRepositoryPort } from '#domains/users/user_repository'
import UserEntity from '../entities/user_entity.js'
import { User, type UserId } from '#domains/users/user_model'
import { CreateUserDto } from '#domains/users/user_dto'
import { randomUUID } from 'node:crypto'

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
    const user = await UserEntity.query()
      .where('email', email)
      .whereNull('deleted_at')
      .first()
    return user ? user.toDomain() : null
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const defaultPictureName = `https://picsum.photos/536/${Math.floor(Math.random() * 536)}`
    const user = await UserEntity.create({
      userId: randomUUID(),
      email: createUserDto.email,
      password: createUserDto.password,
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      birthdate: createUserDto.birthdate,
      avatar: createUserDto.avatar || defaultPictureName,
    })
    return user.toDomain()
  }
}
