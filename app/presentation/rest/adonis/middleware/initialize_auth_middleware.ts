import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import JwtUtil from '#config/jwt'
import { UserService } from '#domains/users/user_service'
import { User } from '#domains/users/user_model'

@inject()
export default class InitializeAuthMiddleware {
  constructor(private readonly userService: UserService) {}

  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const authorization = ctx.request.header('Authorization')
    if (authorization) {
      const token = authorization.replace('Bearer ', '')
      try {
        const payload = JwtUtil.decodeToken(token)
        const user = await this.userService.getById(payload.id)
        if (user) {
          ctx.auth = { user }
        }
      } catch (err) {
        ctx.response.status(410).send({ message: 'Invalid token, login again' })
        ctx.response.finish()
      }
    }
    await next()
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth: {
      user: User | never
    }
  }
}
