import { ConversationRepositoryPort } from '#domains/users/conversations/conversation_repository'
import { UserId } from '#domains/users/user_model'
import { Conversation, ConversationId } from '#domains/users/conversations/conversation_model'
import ConversationEntity from '#infrastructure/orm/lucid/entities/conversation_entity'

export class ConversationRepositoryImpl implements ConversationRepositoryPort {
  constructor() {}

  async getByUser(userId: UserId): Promise<Conversation[]> {
    const conversations = await ConversationEntity.query()
      .where('ownerId', userId)
      .preload('owner')
      .preload('participants')
      .preload('messages')
    return conversations.map((conversation) => conversation.toDomain())
  }

  async getById(conversationId: ConversationId): Promise<Conversation> {
    const conversation = await ConversationEntity.query()
      .where('conversationId', conversationId)
      .preload('owner')
      .preload('participants')
      .preload('messages', (query) => {
        query.preload('sender')
      })
      .firstOrFail()
    return conversation.toDomain()
  }

  async create(conversation: Conversation): Promise<Conversation> {
    const conversationEntity = await ConversationEntity.create({
      conversationId: conversation.conversationId,
      ownerId: conversation.owner.userId,
    })
    await conversationEntity
      .related('participants')
      .attach(conversation.members.map((m) => m.userId))
    //

    const savedConversation = await ConversationEntity.query()
      .where('ownerId', conversation.owner.userId)
      .preload('owner')
      .preload('participants')
      .preload('messages', (query) => {
        query.preload('sender')
      })
      .firstOrFail()
    return savedConversation.toDomain()
  }

  async removeUser(conversationId: ConversationId, memberId: UserId): Promise<ConversationId> {
    const conversation = await ConversationEntity.query()
      .where('conversationId', conversationId)
      .preload('participants')
      .firstOrFail()
    await conversation.related('participants').detach([memberId])
    return conversation.conversationId
  }
}
