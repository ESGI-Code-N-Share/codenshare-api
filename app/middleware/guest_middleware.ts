import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class GuestMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('Authorization')
    console.log('GuestMiddleware: Checking authorization header')

    if (authHeader) {
      authHeader.replace('Bearer ', '')
    } else {
      console.log('GuestMiddleware: No authorization header found')
    }

    await next()
  }
}
