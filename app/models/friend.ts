import {DateTime} from 'luxon'
import type {BelongsTo} from '@adonisjs/lucid/types/relations'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import User from '#models/user'
import {Opaque} from '@poppinss/utils/types'

export type FriendId = Opaque<'friendId', string>

export default class Friend extends BaseModel {
  @column({ isPrimary: true })
  declare friendId: FriendId

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'requestedById',
  })
  declare requested_by: BelongsTo<typeof User>

  @belongsTo(() => User)
  declare addressed_to: BelongsTo<typeof User>
}
