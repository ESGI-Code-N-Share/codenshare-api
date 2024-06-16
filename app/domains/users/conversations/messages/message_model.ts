import { User } from '#domains/users/user_model'
import { randomUUID } from 'node:crypto'
import { ConversationId } from '#domains/users/conversations/conversation_model'

export type MessageId = string

export class Message {
  messageId: MessageId
  content: string
  conversationId: ConversationId
  image?: string
  sender: User
  sendAt: Date

  private constructor(
    messageId: MessageId,
    content: string,
    conversationId: ConversationId,
    sender: User,
    sendAt: Date,
    image?: string
  ) {
    this.messageId = messageId
    this.content = content
    this.conversationId = conversationId
    this.image = image
    this.sender = sender
    this.sendAt = sendAt
  }

  static new(content: string, sender: User, conversationId: ConversationId, image?: string) {
    return new Message(
      randomUUID() as MessageId,
      content,
      conversationId,
      sender,
      new Date(),
      image
    )
  }

  static fromPersistence(data: {
    messageId: MessageId
    content: string
    conversationId: ConversationId
    image?: string
    sender: User
    sendAt: Date
  }) {
    return new Message(
      data.messageId,
      data.content,
      data.conversationId,
      data.sender,
      data.sendAt,
      data.image
    )
  }
}
