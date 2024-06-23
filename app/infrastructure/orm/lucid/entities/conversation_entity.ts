import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { type UserId } from '#domains/users/user_model'
import UserEntity from '#infrastructure/orm/lucid/entities/user_entity'
import { type BelongsTo, type HasMany, type ManyToMany } from '@adonisjs/lucid/types/relations'
import MessageEntity from '#infrastructure/orm/lucid/entities/message_entity'
import { DateTime } from 'luxon'
import { Conversation } from '#domains/users/conversations/conversation_model'

export default class ConversationEntity extends BaseModel {
  static table = 'conversations'

  @column({ isPrimary: true })
  declare conversationId: string

  @column()
  declare ownerId: UserId

  @belongsTo(() => UserEntity, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof UserEntity>

  @manyToMany(() => UserEntity, {
    pivotTable: 'user_conversation',
    localKey: 'conversationId',
    pivotForeignKey: 'conversation_id',
    relatedKey: 'userId',
    pivotRelatedForeignKey: 'user_id',
  })
  declare participants: ManyToMany<typeof UserEntity>

  @hasMany(() => MessageEntity, {
    foreignKey: 'conversationId',
  })
  declare messages: HasMany<typeof MessageEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare deletedAt?: DateTime

  toDomain(): Conversation {
    return Conversation.fromPersistence({
      conversationId: this.conversationId,
      owner: this.owner.toDomain(),
      members: this.participants.map((participant) => participant.toDomain()),
      messages: this.messages.map((message) => message.toDomain()),
      createdAt: this.createdAt?.toJSDate(),
    })
  }
}
