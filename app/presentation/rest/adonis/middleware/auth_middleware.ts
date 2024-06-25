import type { HttpContext } from '@adonisjs/core/http'

export default class AuthMiddleware {
  async handle({ response, auth }: HttpContext, next: () => Promise<void>) {
    try {
      if (!auth || !auth.user) {
        response.unauthorized({ message: 'User not authenticated' })
      }
    } catch (e) {
      console.error(e)
    } finally {
      await next()
    }
  }
}
