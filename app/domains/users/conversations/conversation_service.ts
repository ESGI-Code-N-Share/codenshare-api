import { inject } from '@adonisjs/core'
import {
  ByUserDto,
  CreateConversationDto,
  DeleteConversationDto,
} from '#domains/users/conversations/conversation_dto'
import { Conversation, ConversationId } from '#domains/users/conversations/conversation_model'
import { ConversationRepositoryImpl } from '#infrastructure/orm/lucid/repositories/conversation_repository_impl'
import { UserService } from '#domains/users/user_service'
import {
  ConversationException,
  ConversationMessageException,
} from '#domains/users/conversations/messages/conversation_exception'

@inject()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepositoryImpl,
    private readonly userService: UserService
  ) {
    this.conversationRepository = conversationRepository
  }

  async getByUser(byUserDto: ByUserDto): Promise<Conversation[]> {
    return this.conversationRepository.getByUser(byUserDto.userId)
  }

  async getById(conversationId: ConversationId): Promise<Conversation> {
    try {
      return await this.conversationRepository.getById(conversationId)
    } catch (e) {
      console.error(e)
      throw new ConversationException(ConversationMessageException.CONVERSATION_NOT_FOUND)
    }
  }

  async create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const { ownerId, memberIds } = createConversationDto
    const owner = await this.userService.getById(ownerId)
    const participants = await Promise.all(
      memberIds.map((userId) => this.userService.getById(userId))
    )

    const uniqueMemberIds = Array.from(new Set([...memberIds, ownerId]))
    if (uniqueMemberIds.length <= 1) {
      throw new ConversationException(ConversationMessageException.AT_LEAST_TWO_PARTICIPANTS)
    }

    const conversation = Conversation.new(owner, participants)
    return this.conversationRepository.create(conversation)
  }

  async leave(leaveConversationDto: DeleteConversationDto): Promise<ConversationId> {
    const { conversationId, userId } = leaveConversationDto
    const conversation = await this.getById(conversationId)
    if (conversation.owner.userId === userId) {
      return this.conversationRepository.delete(conversationId)
    }
    return this.conversationRepository.removeUser(conversationId, userId)
  }
}
