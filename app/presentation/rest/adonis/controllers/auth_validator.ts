import vine from '@vinejs/vine'

export const loginAuthValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
    stayLogin: vine.boolean(),
  })
)

export const registerAuthValidator = vine.compile(
  vine.object({
    firstname: vine.string().minLength(2),
    lastname: vine.string().minLength(2),
    email: vine.string().email(),
    password: vine.string().minLength(6),
    birthdate: vine.date({ formats: ['YYYY-MM-DD'] }),
    emailVerified: vine.boolean().optional(),
  })
)

export const passwordRecoveryAuthValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

export const passwordResetAuthValidator = vine.compile(
  vine.object({
    token: vine.string().uuid(),
    password: vine.string().minLength(6),
  })
)
