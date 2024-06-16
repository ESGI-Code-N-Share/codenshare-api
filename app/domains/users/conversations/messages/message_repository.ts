import { ConversationId } from '#domains/users/conversations/conversation_model'
import { Message } from '#domains/users/conversations/messages/message_model'

export interface MessageRepositoryPort {
  getByConversation(conversationId: ConversationId): Promise<Message[]>

  create(message: Message): Promise<Message>
}
