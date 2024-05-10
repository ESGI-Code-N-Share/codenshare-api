import {DateTime} from 'luxon'
import type {HasMany} from '@adonisjs/lucid/types/relations'
import type {Opaque} from '@poppinss/utils/types'
import {BaseModel, column, hasMany} from '@adonisjs/lucid/orm'
import Post from '#models/post'
import Friend from '#models/friend'
import Program from '#models/program'

export type UserId = Opaque<'userId', string>

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare userId: UserId

  @column()
  declare email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations with posts
  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  // Relations with programs
  @hasMany(() => Program, {
    foreignKey: 'authorId',
  })
  declare programs: HasMany<typeof Program>

  // Relations with friends
  @hasMany(() => Friend)
  declare friends: HasMany<typeof Friend>

  // Relations with conversations
  // @hasMany(() => Conversation)
  // declare conversations: HasMany<typeof Conversation>
  //
  // // Relations with notifications
  // @hasMany(() => Notification)
  // declare notifications: HasMany<typeof Notification>
  //
  // // Relations with FAQs
  // @hasMany(() => Faq)
  // declare faqs: HasMany<typeof Faq>
}
