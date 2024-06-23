import { UserSample } from '#tests/unit/domains/utils/user_sample'
import { Message } from '#domains/users/conversations/messages/message_model'

export class MessageSample {
  static new(messageData: Partial<Message>): Message {
    return {
      messageId: messageData.messageId ?? '1',
      content: messageData.content ?? 'Content',
      sender: messageData.sender ?? UserSample.new({}),
      image: messageData.image ?? undefined,
      sendAt: messageData.sendAt ?? new Date(),
      conversationId: messageData.conversationId ?? '1',
    }
  }
}
