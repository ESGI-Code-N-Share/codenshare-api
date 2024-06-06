import { UserId } from '#domains/users/user_model'
import { Conversation, ConversationId } from '#domains/users/conversations/conversation_model'

export interface ConversationRepositoryPort {
  getByUser(userId: UserId): Promise<Conversation[]>

  getById(conversationId: ConversationId): Promise<Conversation>

  create(conversation: Conversation): Promise<Conversation>

  removeUser(conversationId: ConversationId, memberId: UserId): Promise<ConversationId>

  delete(conversationId: ConversationId): Promise<ConversationId>
}
