import type { HttpContext } from '@adonisjs/core/http'

export default class AdminMiddleware {
  async handle({ response, auth }: HttpContext, next: () => Promise<void>) {
    try {
      if (!auth || !auth.user) {
        response.unauthorized({ message: 'User not authenticated' })
      } else {
        const user = auth.user
        if (user.role !== 'admin') {
          response.unauthorized({ message: 'User not authorized' })
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      await next()
    }
  }
}
