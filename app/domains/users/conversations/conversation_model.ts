import { User } from '#domains/users/user_model'
import { randomUUID } from 'node:crypto'
import Message from '#domains/users/conversations/messages/message_model'

export type ConversationId = string

export class Conversation {
  conversationId: ConversationId
  owner: User
  members: User[]
  messages: Message[]
  createdAt: Date

  private constructor(
    conversationId: ConversationId,
    owner: User,
    members: User[],
    messages: Message[],
    createdAt: Date
  ) {
    this.conversationId = conversationId
    this.owner = owner
    this.members = members
    this.messages = messages
    this.createdAt = createdAt
  }

  static new(owner: User, members: User[]) {
    return new Conversation(randomUUID() as ConversationId, owner, members, [], new Date())
  }

  static fromPersistence(data: {
    conversationId: ConversationId
    owner: User
    members: User[]
    messages: Message[]
    createdAt: Date
  }) {
    return new Conversation(
      data.conversationId,
      data.owner,
      data.members,
      data.messages,
      data.createdAt
    )
  }
}
