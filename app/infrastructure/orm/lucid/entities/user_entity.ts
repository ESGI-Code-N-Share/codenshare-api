import { BaseModel, column } from '@adonisjs/lucid/orm'
import { User, type UserId, type UserRole } from '#domains/users/user_model'
import { DateTime } from 'luxon'

export default class UserEntity extends BaseModel {
  static table = 'users'

  @column({ isPrimary: true })
  declare userId: UserId

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column()
  declare email: string

  @column()
  declare birthdate: Date

  @column()
  declare avatar: string

  @column()
  declare overview?: string

  @column()
  declare role: UserRole

  @column()
  declare token?: string | null | undefined

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare deletedAt?: DateTime

  toDomain(): User {
    return User.fromPersistence({
      userId: this.userId,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      birthdate: this.birthdate,
      avatar: this.avatar,
      overview: this.overview,
      role: this.role,
      token: this.token,
      password: this.password,
      createdAt: this.createdAt.toJSDate(),
    })
  }
}
