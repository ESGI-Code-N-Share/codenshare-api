import vine from '@vinejs/vine'

export const createFriendValidator = vine.compile(
  vine.object({
    followerId: vine.string().uuid(),
    followedId: vine.string().uuid(),
  })
)

export const deleteFriendValidator = vine.compile(
  vine.object({
    followerId: vine.string().uuid(),
    followedId: vine.string().uuid(),
  })
)
