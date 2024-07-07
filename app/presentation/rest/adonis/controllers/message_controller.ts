import { inject } from '@adonisjs/core'
import { MessageService } from '#domains/users/conversations/messages/message_service'
import { HttpContext } from '@adonisjs/core/http'
import { sendMessageValidator } from '#presentation/rest/adonis/controllers/message_validator'
import { SendMessageDto } from '#domains/users/conversations/messages/message_dto'

@inject()
export default class MessageController {
  constructor(protected readonly messageService: MessageService) {
    this.messageService = messageService
  }

  async getByConversation({ params, response }: HttpContext) {
    try {
      const messages = await this.messageService.getByConversation(params.conversationId)
      return response.status(200).json({ data: messages })
    } catch (e) {
      console.error(e)
      return response.status(500)
    }
  }

  async send({ request, response, params }: HttpContext) {
    try {
      const data = { ...request.all(), ...params }
      const validSend = await sendMessageValidator.validate(data)
      const sendMessageDto: SendMessageDto = {
        conversationId: validSend.conversationId,
        senderId: validSend.userId,
        content: validSend.content,
        image: validSend.image,
      }
      const message = await this.messageService.send(sendMessageDto)
      return response.status(201).json({ data: message })
    } catch (e) {
      console.error(e)
      return response.status(500)
    }
  }
}
