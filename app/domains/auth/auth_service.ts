import { UserService } from '#domains/users/user_service'
import { inject } from '@adonisjs/core'
import { LoginAuthDto, RegisterAuthDto } from '#domains/auth/auth_dto'
import { User } from '#domains/users/user_model'
import { AuthException, AuthMessageException } from '#domains/auth/auth_exception'
import Hash from '@adonisjs/core/services/hash'

@inject()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginAuthDto: LoginAuthDto): Promise<User> {
    const { email, password } = loginAuthDto
    try {
      const user = await this.userService.getByEmail(email)
      if (!user) {
        throw new AuthException(AuthMessageException.USER_WITH_CREDENTIALS_NOT_FOUND)
      }

      const isPasswordValid = await Hash.verify(user.password, password)
      if (!isPasswordValid) {
        throw new AuthException(AuthMessageException.WRONG_PASSWORD)
      }

      return user
    } catch (error) {
      throw new AuthException(AuthMessageException.USER_WITH_CREDENTIALS_NOT_FOUND)
    }
  }

  async register(registerAuthDto: RegisterAuthDto): Promise<User> {
    const { email, password, firstname, lastname, birthdate} = registerAuthDto

    try {
      const existingUser = await this.userService.getByEmail(email)
      if (existingUser) {
        throw new AuthException(AuthMessageException.USER_WITH_EMAIL_ALREADY_EXISTS)
      }

      const hashedPassword = await Hash.make(password)

      const newUser = await this.userService.create({
        email,
        password: hashedPassword,
        firstname,
        lastname,
        birthdate,
      })

      return newUser
    } catch (error) {
      console.error('Registration Error:', error)
      throw new AuthException(AuthMessageException.REGISTRATION_FAILED)
    }
  }
}
