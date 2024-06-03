import vine from '@vinejs/vine'

export const sendMessageValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid(),
    conversationId: vine.string().uuid(),
    content: vine.string().trim().minLength(1),
  })
)
