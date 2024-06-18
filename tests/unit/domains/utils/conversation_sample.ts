import { Conversation } from '#domains/users/conversations/conversation_model'
import { UserSample } from '#tests/unit/domains/utils/user_sample'
import { MessageSample } from '#tests/unit/domains/utils/message_sample'

export class ConversationSample {
  static new(conversationData: Partial<Conversation>): Conversation {
    return {
      conversationId: conversationData.conversationId ?? '1',
      owner: conversationData.owner ?? UserSample.new({}),
      members: conversationData.members ?? [UserSample.new({}), UserSample.new({})],
      messages: conversationData.messages ?? [MessageSample.new({}), MessageSample.new({})],
      createdAt: conversationData.createdAt ?? new Date(),
    }
  }
}
