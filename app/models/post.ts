import {DateTime} from 'luxon'
import type {BelongsTo} from '@adonisjs/lucid/types/relations'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import User from '#models/user'
import {Opaque} from '@poppinss/utils/types'

export type PostId = Opaque<'PostId', string>

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: PostId

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
