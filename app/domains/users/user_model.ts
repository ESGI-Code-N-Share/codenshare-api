import { randomUUID } from 'node:crypto'

export type UserId = string
export type UserRole = 'admin' | 'moderator' | 'user'

export class User {
  userId: UserId
  firstname: string
  lastname: string
  email: string
  birthdate: Date

  avatar: string
  role: UserRole
  overview?: string
  token?: string
  password: string

  createdAt: Date

  private constructor(
    userId: UserId,
    firstname: string,
    lastname: string,
    email: string,
    birthdate: Date,
    avatar: string,
    role: UserRole,
    password: string,
    createdAt: Date = new Date(),
    token?: string,
    overview?: string
  ) {
    this.userId = userId
    this.firstname = firstname
    this.lastname = lastname
    this.email = email
    this.birthdate = birthdate
    this.avatar = avatar
    this.role = role
    this.overview = overview
    this.token = token
    this.password = password
    this.createdAt = createdAt
  }

  static new(
    firstname: string,
    lastname: string,
    email: string,
    birthdate: Date,
    password: string,
    avatar: string,
    role: UserRole = 'user'
  ) {
    return new User(randomUUID(), firstname, lastname, email, birthdate, avatar, role, password)
  }

  static fromPersistence(data: {
    userId: UserId
    firstname: string
    lastname: string
    email: string
    birthdate: Date
    avatar: string
    role: UserRole
    password: string
    createdAt: Date
    token?: string
    overview?: string
  }) {
    return new User(
      data.userId,
      data.firstname,
      data.lastname,
      data.email,
      data.birthdate,
      data.avatar,
      data.role,
      data.password,
      data.createdAt,
      data.token,
      data.overview
    )
  }
}
