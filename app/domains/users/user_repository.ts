import { User, UserId } from '#domains/users/user_model'
import { CreateUserDto } from '#domains/users/user_dto'

export interface UserRepositoryPort {
  searchByEmail(query: string): Promise<User[]>

  searchByFirstnameOrLastname(query: string): Promise<User[]>

  getById(userId: UserId): Promise<User>

  delete(userId: UserId): Promise<void>

  getByEmail(email: string): Promise<User | null>

  create(createUserDto: CreateUserDto): Promise<User>
}
