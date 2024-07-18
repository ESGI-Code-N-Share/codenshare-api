import { inject } from '@adonisjs/core'
import { MessageRepositoryImpl } from '#infrastructure/orm/lucid/repositories/message_repository_impl'
import { ConversationService } from '#domains/users/conversations/conversation_service'
import { UserService } from '#domains/users/user_service'
import { Message } from '#domains/users/conversations/messages/message_model'
import { ConversationId } from '#domains/users/conversations/conversation_model'
import { SendMessageDto } from '#domains/users/conversations/messages/message_dto'
import socketService from '#start/socket'

@inject()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepositoryImpl,
    private readonly conversationService: ConversationService,
    private readonly userService: UserService
  ) {}

  async getByConversation(conversationId: ConversationId): Promise<Message[]> {
    return this.messageRepository.getByConversation(conversationId)
  }

  async send(messageDto: SendMessageDto): Promise<Message> {
    const { conversationId, senderId, content, image } = messageDto
    const sender = await this.userService.getById(senderId)
    const conversation = await this.conversationService.getById(conversationId)
    const message = Message.new(content, sender, conversation.conversationId, image)
    const savedMessage = await this.messageRepository.create(message)

    // emit 'new_message' to all connected client
    socketService.io.emit('new_message', savedMessage)

    return savedMessage
  }
}
