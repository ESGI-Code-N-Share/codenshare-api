import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1),
    content: vine.string().trim().minLength(1),
    authorId: vine.string().uuid(),
    image: vine.string().optional(),
  })
)
