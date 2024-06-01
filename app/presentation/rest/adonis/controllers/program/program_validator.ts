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
    authorId: vine.string().trim().minLength(1),
    name: vine.string().trim().minLength(1),
    description: vine.string().trim().minLength(1),
    pictureURL: vine.string().trim().minLength(1),
    visibility: vine.string().trim().minLength(1),
    language: vine.string().trim().minLength(1),
    code: vine.string().trim().minLength(1),
  })
)

export const createProgramValidator = vine.compile(
  vine.object({
    authorId: vine.string().trim().minLength(1),
  })
)
