import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import {
  byUserValidator,
  createConversationValidator,
  deleteConversationValidator,
} from '#presentation/rest/adonis/controllers/conversation_validator'
import {
  ByUserDto,
  CreateConversationDto,
  DeleteConversationDto,
} from '#domains/users/conversations/conversation_dto'
import { ConversationService } from '#domains/users/conversations/conversation_service'

@inject()
export default class ConversationController {
  constructor(private readonly conversationService: ConversationService) {
    this.conversationService = conversationService
  }

  async getByUser({ response, params }: HttpContext) {
    try {
      const validByUser = await byUserValidator.validate(params)
      const byUserDto: ByUserDto = {
        userId: validByUser.userId,
      }
      const conversations = await this.conversationService.getByUser(byUserDto)
      return response.status(200).json({ data: conversations })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async create({ response, request, params }: HttpContext) {
    try {
      const data = { ...request.all(), ...params }
      const validCreate = await createConversationValidator.validate(data)
      const createDto: CreateConversationDto = {
        ownerId: validCreate.userId,
        memberIds: validCreate.memberIds,
      }
      const conversation = await this.conversationService.create(createDto)
      return response.status(201).json({ data: conversation })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async delete({ response, params }: HttpContext) {
    try {
      const validDelete = await deleteConversationValidator.validate(params)
      const deleteConversationDto: DeleteConversationDto = {
        userId: validDelete.userId,
        conversationId: validDelete.conversationId,
      }
      const conversationId = await this.conversationService.leave(deleteConversationDto)
      return response.status(200).json({ data: conversationId })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }
}
