import vine from '@vinejs/vine'

export const programsValidator = vine.compile(
  vine.object({
    userId: vine.string().trim().minLength(1),
  })
)

export const searchProgramsValidator = vine.compile(
  vine.object({
    query: vine.string().trim().minLength(1),
  })
)

export const updateProgramsValidator = vine.compile(
  vine.object({
    authorId: vine.string().uuid().trim(),
    name: vine.string().trim().minLength(1),
    description: vine.string().trim(),
    pictureURL: vine.string().trim().url(),
    visibility: vine.string().trim().in(['public', 'private', 'protected']),
    language: vine.string().trim(),
    code: vine.string().trim().optional(),
  })
)

export const createProgramValidator = vine.compile(
  vine.object({
    authorId: vine.string().trim().minLength(1),
  })
)
