import vine from '@vinejs/vine'

export const byUserValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid(),
  })
)

export const createConversationValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid(),
    memberIds: vine.array(vine.string().uuid()).minLength(1),
  })
)

export const deleteConversationValidator = vine.compile(
  vine.object({
    memberId: vine.string().uuid(),
    conversationId: vine.string().uuid(),
  })
)
