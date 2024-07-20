import vine from '@vinejs/vine'

export const searchUserValidator = vine.compile(
  vine.object({
    query: vine.string().trim().minLength(1),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    firstname: vine.string(),
    lastname: vine.string(),
    overview: vine.string().optional(),
  })
)
