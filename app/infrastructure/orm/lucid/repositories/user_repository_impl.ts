import { type UserRepositoryPort } from '#domains/users/user_repository'
import UserEntity from '../models/user_entity.js'
import { User, type UserId } from '#domains/users/user_model'

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
}
