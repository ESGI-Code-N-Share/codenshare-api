import { User, UserId } from '#domains/users/user_model'

export interface UserRepositoryPort {
  searchByEmail(query: string): Promise<User[]>

  searchByFirstnameOrLastname(query: string): Promise<User[]>

  getById(userId: UserId): Promise<User>

  delete(userId: UserId): Promise<void>
}
