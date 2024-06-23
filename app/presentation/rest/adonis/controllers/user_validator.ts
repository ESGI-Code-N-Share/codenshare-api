import vine from '@vinejs/vine'

export const searchUserValidator = vine.compile(
  vine.object({
    query: vine.string().trim().minLength(1),
  })
)
