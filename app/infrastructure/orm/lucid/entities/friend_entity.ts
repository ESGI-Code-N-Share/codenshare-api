import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { Friend, type FriendId } from '#domains/friends/friend_model'
import { type UserId } from '#domains/users/user_model'
import UserEntity from '#infrastructure/orm/lucid/entities/user_entity'

export default class FriendEntity extends BaseModel {
  static table = 'friends'

  @column({ isPrimary: true })
  declare friendId: FriendId

  @column()
  declare requestedBy: UserId

  @column()
  declare addressedTo: UserId

  @belongsTo(() => UserEntity, {
    foreignKey: 'requestedBy',
  })
  declare sender: BelongsTo<typeof UserEntity>

  @belongsTo(() => UserEntity, {
    foreignKey: 'addressedTo',
  })
  declare receiver: BelongsTo<typeof UserEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  toDomain(): Friend {
    return Friend.fromPersistence({
      friendId: this.friendId,
      requestedBy: this.sender.toDomain(),
      addressedTo: this.receiver.toDomain(),
      createdAt: this.createdAt.toJSDate(),
    })
  }
}
