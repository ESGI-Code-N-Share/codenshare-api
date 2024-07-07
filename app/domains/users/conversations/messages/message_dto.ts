import { ConversationId } from '#domains/users/conversations/conversation_model'
import { UserId } from '#domains/users/user_model'

export interface SendMessageDto {
  conversationId: ConversationId
  senderId: UserId
  content: string
  image?: string
}
