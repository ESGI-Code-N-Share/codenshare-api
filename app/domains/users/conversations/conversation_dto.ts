import { UserId } from '#domains/users/user_model'
import { type ConversationId } from '#domains/users/conversations/conversation_model'

export interface ByUserDto {
  userId: UserId
}

export interface CreateConversationDto {
  ownerId: UserId
  memberIds: UserId[]
}

export interface DeleteConversationDto {
  userId: UserId
  conversationId: ConversationId
}
