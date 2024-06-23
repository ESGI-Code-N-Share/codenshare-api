import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#infrastructure/orm/lucid/entities/user_entity'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class AuthMiddleware {
  async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const authHeader = request.header('Authorization')

    if (!authHeader) {
      console.log('No token provided')
      return response.unauthorized({ message: 'Missing token' })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('Token:', token)

    try {
      jwt.verify(token, env.get('JWT_SECRET_KEY'))

      const user = await User.findByOrFail('token', token)

      if (!request.auth) {
        request.auth = {}
      }

      request.auth.user = user

      await next()
    } catch (error) {
      console.error('Token verification failed:', error)
      return response.unauthorized({ message: 'Invalid token' })
    }
  }
}
