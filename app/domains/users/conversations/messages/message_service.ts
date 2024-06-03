import { inject } from '@adonisjs/core'
import { MessageRepositoryImpl } from '#infrastructure/orm/lucid/repositories/message_repository_impl'
import Message from '#domains/users/conversations/messages/message_model'
import { ConversationId } from '#domains/users/conversations/conversation_model'
import { UserService } from '#domains/users/user_service'
import { ConversationService } from '#domains/users/conversations/conversation_service'
import { type SendMessageDto } from '#domains/users/conversations/messages/message_dto'

@inject()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepositoryImpl,
    private readonly conversationService: ConversationService,
    private readonly userService: UserService
  ) {
    this.messageRepository = messageRepository
  }

  async getByConversation(conversationId: ConversationId): Promise<Message[]> {
    return this.messageRepository.getByConversation(conversationId)
  }

  async send(messageDto: SendMessageDto): Promise<Message> {
    const { conversationId, senderId, content } = messageDto
    const sender = await this.userService.getById(senderId)
    const conversation = await this.conversationService.getById(conversationId)
    const message = Message.new(content, sender, conversation.conversationId)
    return this.messageRepository.create(message)
  }
}
