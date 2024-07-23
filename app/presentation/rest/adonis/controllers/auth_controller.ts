import { inject } from '@adonisjs/core'
import { AuthService } from '#domains/auth/auth_service'
import { HttpContext } from '@adonisjs/core/http'
import {
  loginAuthValidator,
  registerAuthValidator,
} from '#presentation/rest/adonis/controllers/auth_validator'
import { LoginAuthDto, RegisterAuthDto } from '#domains/auth/auth_dto'
import env from '#start/env'

@inject()
export default class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService
  }

  async login({ request, response }: HttpContext) {
    try {
      const validData = await loginAuthValidator.validate(request.body())
      const loginAuthDto: LoginAuthDto = {
        email: validData.email,
        password: validData.password,
      }

      const stayLogin = validData.stayLogin ?? false
      const user = await this.authService.login(loginAuthDto, stayLogin)

      return response.status(200).json({
        data: user,
      })
    } catch (e) {
      console.error(e)
      return response.status(400).send({
        data: {
          message: e.message,
        },
      })
    }
  }

  async register({ request, response }: HttpContext) {
    try {
      const validData = await registerAuthValidator.validate(request.body())
      const defaultEmailVerified = validData.emailVerified || false
      const registerAuthDto: RegisterAuthDto = {
        firstname: validData.firstname,
        lastname: validData.lastname,
        email: validData.email,
        password: validData.password,
        birthdate: new Date(validData.birthdate),
        emailVerified: defaultEmailVerified,
      }

      const defaultHost = env.get('HOST')
      const defaultPort = env.get('PORT')
      const host = request.host() || `${defaultHost}:${defaultPort}`
      const protocol = request.protocol() || 'http'

      const userId = await this.authService.register(registerAuthDto, host, protocol)
      return response.status(201).json({ data: userId })
    } catch (e) {
      console.error('Registration error:', e)
      return response.status(400).send({
        data: {
          message: e.message,
        },
      })
    }
  }

  async logout({ request, response }: HttpContext) {
    try {
      const userId = request.input('userId')
      await this.authService.logout(userId)
      return response.status(200).json({ message: 'Logout successful' })
    } catch (e) {
      console.error(e)
      return response.status(400).send({
        data: {
          message: e.message,
        },
      })
    }
  }

  async verifyEmail({ params, response }: HttpContext) {
    try {
      const userId = params.id
      if (!userId) {
        return response.status(400).send({
          data: {
            message: 'Invalid user id',
          },
        })
      }

      await this.authService.verifyEmail(userId)

      return response.redirect(`${env.get('FRONTEND_URL')}/email-verified`)
    } catch (e) {
      console.error(e)
      return response.status(400).send({
        data: {
          message: e.message,
        },
      })
    }
  }
}
