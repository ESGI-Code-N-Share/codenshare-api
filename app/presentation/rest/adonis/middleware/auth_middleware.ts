import type { HttpContext } from '@adonisjs/core/http'

export default class AuthMiddleware {
  async handle({ response, auth }: HttpContext, next: () => Promise<void>) {
    try {
      if (!auth || !auth.user) {
        response.unauthorized({ message: 'User not authenticated 2' })
        response.finish()
      }

      if (!auth.user.emailVerified) {
        response.unauthorized({ message: 'Verify your email first' })
        response.finish()
      }
    } catch (e) {
      console.error(e)
    } finally {
      await next()
    }
  }
}
