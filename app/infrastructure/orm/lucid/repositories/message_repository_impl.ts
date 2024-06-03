import MessageEntity from '#infrastructure/orm/lucid/entities/message_entity'
import Message from '#domains/users/conversations/messages/message_model'
import { type ConversationId } from '#domains/users/conversations/conversation_model'
import { MessageRepositoryPort } from '#domains/users/conversations/messages/message_repository'

export class MessageRepositoryImpl implements MessageRepositoryPort {
  async getByConversation(conversationId: ConversationId): Promise<Message[]> {
    const messages = await MessageEntity.query()
      .where('conversationId', conversationId)
      .preload('sender')
      .preload('conversation', (query) => {
        query.preload('owner').preload('participants')
      })
    return messages.map((message) => message.toDomain())
  }

  async create(message: Message): Promise<Message> {
    const newMessage = await MessageEntity.create({
      messageId: message.messageId,
      conversationId: message.conversationId,
      senderId: message.sender.userId,
      content: message.content,
    })
    const savedMessage = await MessageEntity.query()
      .where('messageId', newMessage.messageId)
      .preload('sender')
      .preload('conversation', (query) => {
        query.preload('owner').preload('participants')
      })
      .firstOrFail()
    return savedMessage.toDomain()
  }
}
