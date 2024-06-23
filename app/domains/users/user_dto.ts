import { UserId } from '#domains/users/user_model'

export interface SearchUserDto {
  query: string
}

export interface CreateUserDto {
  userId?: UserId
  email: string
  password: string
  firstname: string
  lastname: string
  birthdate: Date
  avatar?: string
}
