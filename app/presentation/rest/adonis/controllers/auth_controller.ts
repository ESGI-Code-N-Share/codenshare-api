import { inject } from '@adonisjs/core'
import { AuthService } from '#domains/auth/auth_service'
import { HttpContext } from '@adonisjs/core/http'
import {
  loginAuthValidator,
  registerAuthValidator,
} from '#presentation/rest/adonis/controllers/auth_validator'
import { LoginAuthDto, RegisterAuthDto } from '#domains/auth/auth_dto'

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
      const user = await this.authService.login(loginAuthDto)
      return response.status(200).json({
        message: 'Vous êtes connecté',
        data: user,
      })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async register({ request, response }: HttpContext) {
    try {
      const validData = await registerAuthValidator.validate(request.body())
      const registerAuthDto: RegisterAuthDto = {
        firstname: validData.firstname,
        lastname: validData.lastname,
        email: validData.email,
        password: validData.password,
        birthdate: new Date(validData.birthdate),
      }
      const user = await this.authService.register(registerAuthDto)
      return response.status(201).json({
        message: 'Vous êtes inscris',
        data: user,
      })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }
}
