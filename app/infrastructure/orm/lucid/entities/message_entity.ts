import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { type UserId } from '#domains/users/user_model'
import UserEntity from '#infrastructure/orm/lucid/entities/user_entity'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Message from '#domains/users/conversations/messages/message_model'
import ConversationEntity from '#infrastructure/orm/lucid/entities/conversation_entity'

export default class MessageEntity extends BaseModel {
  static table = 'messages'

  @column({ isPrimary: true })
  declare messageId: string

  @column()
  declare content: string

  @column()
  declare image?: string

  @column()
  declare senderId: UserId

  @column()
  declare conversationId: string

  @belongsTo(() => ConversationEntity, {
    foreignKey: 'conversationId',
  })
  declare conversation: BelongsTo<typeof ConversationEntity>

  @belongsTo(() => UserEntity, {
    foreignKey: 'senderId',
  })
  declare sender: BelongsTo<typeof UserEntity>

  @column.dateTime({ autoCreate: true })
  declare sendAt: DateTime

  toDomain(): Message {
    return Message.fromPersistence({
      messageId: this.messageId,
      content: this.content,
      conversationId: this.conversationId,
      image: this.image,
      sender: this.sender.toDomain(),
      sendAt: this.sendAt.toJSDate(),
    })
  }
}
