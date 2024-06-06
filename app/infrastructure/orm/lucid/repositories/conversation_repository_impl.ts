import { ConversationRepositoryPort } from '#domains/users/conversations/conversation_repository'
import { UserId } from '#domains/users/user_model'
import { Conversation, ConversationId } from '#domains/users/conversations/conversation_model'
import ConversationEntity from '#infrastructure/orm/lucid/entities/conversation_entity'
import { DateTime } from 'luxon'

export class ConversationRepositoryImpl implements ConversationRepositoryPort {
  constructor() {}

  async getByUser(userId: UserId): Promise<Conversation[]> {
    const conversations = await ConversationEntity.query()
      .join(
        'user_conversation',
        'conversations.conversation_id',
        'user_conversation.conversation_id'
      )
      .where('user_conversation.user_id', userId)
      .orWhere('conversations.owner_id', userId)
      .preload('owner')
      .preload('participants')
      .preload('messages', (query) => {
        query.preload('sender')
      })

    const uniqueConversations = conversations
      .filter(
        (conversation, index, self) =>
          index === self.findIndex((t) => t.conversationId === conversation.conversationId)
      )
      .filter((c) => c.deletedAt === null)
      .toSorted((a, b) => {
        const lastA = a.messages.at(-1)
        const lastB = b.messages.at(-1)
        if (!lastA || !lastB) return 0
        return lastB.sendAt.toMillis() - lastA.sendAt.toMillis()
      })
    return uniqueConversations.map((c) => c.toDomain())
  }

  async getById(conversationId: ConversationId): Promise<Conversation> {
    const conversation = await ConversationEntity.query()
      .where('conversationId', conversationId)
      .whereNull('deletedAt')
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

  async delete(conversationId: ConversationId): Promise<ConversationId> {
    const conversation = await ConversationEntity.findOrFail(conversationId)
    conversation.deletedAt = DateTime.now()
    await conversation.save()
    return conversation.conversationId
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
