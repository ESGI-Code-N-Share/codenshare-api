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
    version: vine.string().trim().optional(),
    code: vine.string().trim().optional(),
  })
)

export const updateInstructionsValidator = vine.compile(
  vine.object({
    instructions: vine.object({
      inputs: vine.array(
        vine.object({
          name: vine.string().trim().minLength(1),
          type: vine.string().trim().minLength(1),
        })
      ),
      outputs: vine.array(
        vine.object({
          name: vine.string().trim().minLength(1),
          type: vine.string().trim().minLength(1),
        })
      ),
    }),
  })
)

export const createProgramValidator = vine.compile(
  vine.object({
    authorId: vine.string().trim().minLength(1),
  })
)
