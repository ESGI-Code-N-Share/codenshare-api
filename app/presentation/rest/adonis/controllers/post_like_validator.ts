import vine from '@vinejs/vine'

export const postLikeCreateValidator = vine.compile(
  vine.object({
    postId: vine.string().uuid(),
    userId: vine.string().uuid(),
  })
)

export const postLikeDeleteValidator = vine.compile(
  vine.object({
    postId: vine.string().uuid(),
    userId: vine.string().uuid(),
  })
)
