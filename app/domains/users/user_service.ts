import { User, UserId } from '#domains/users/user_model'
import { UserException, UserMessageException } from '#domains/users/user_exception'
import { UserRepositoryImpl } from '../../infrastructure/orm/lucid/repositories/user_repository_impl.js'
import { inject } from '@adonisjs/core'
import { SearchUserDto } from '#domains/users/user_dto'

@inject()
export class UserService {
  constructor(private readonly userRepository: UserRepositoryImpl) {
    this.userRepository = userRepository
  }

  async search(searchUserDto: SearchUserDto): Promise<User[]> {
    const query = searchUserDto.query
    const usersByEmail = await this.userRepository.searchByEmail(query)
    const usersByFirstnameOrLastname = await this.userRepository.searchByFirstnameOrLastname(query)
    const uniqueUsers = new Set([...usersByEmail, ...usersByFirstnameOrLastname])
    return Array.from(uniqueUsers)
  }

  async getById(userId: UserId): Promise<User> {
    try {
      return await this.userRepository.getById(userId)
    } catch (error) {
      throw new UserException(UserMessageException.USER_NOT_FOUND)
    }
  }

  async delete(userId: UserId): Promise<void> {
    const user = await this.getById(userId)
    return this.userRepository.delete(user.userId)
  }
}
