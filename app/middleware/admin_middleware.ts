import type { HttpContext } from '@adonisjs/core/http'
import User from '#infrastructure/orm/lucid/entities/user_entity'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class AdminMiddleware {
  protected redirectTo = '/login'

  async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const authHeader = request.header('Authorization')

    if (!authHeader) {
      return response.unauthorized({ message: 'Missing token' })
    }

    const token = authHeader.replace('Bearer ', '')

    try {
      jwt.verify(token, env.get('JWT_SECRET_KEY'))

      const user = await User.findByOrFail('token', token)

      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Access denied' })
      }

      await next()
    } catch (error) {
      return response.unauthorized({ message: 'Invalid token' })
    }
  }
}
