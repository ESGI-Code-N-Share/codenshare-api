import { UserService } from '#domains/users/user_service'
import { inject } from '@adonisjs/core'
import { LoginAuthDto, RegisterAuthDto } from '#domains/auth/auth_dto'
import { type User, UserId } from '#domains/users/user_model'
import { AuthException, AuthMessageException } from '#domains/auth/auth_exception'
import Hash from '@adonisjs/core/services/hash'

@inject()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginAuthDto: LoginAuthDto): Promise<User> {
    const { email, password } = loginAuthDto
    const user = await this.userService.getByEmail(email)
    if (!user) {
      throw new AuthException(AuthMessageException.USER_WITH_CREDENTIALS_NOT_FOUND)
    }

    const isPasswordValid = await Hash.verify(user.password, password)
    if (!isPasswordValid) {
      throw new AuthException(AuthMessageException.USER_WITH_CREDENTIALS_NOT_FOUND)
    }
    //todo auth: generate token (https://docs.adonisjs.com/guides/preface/introduction)
    //todo auth: remove password from user object
    return user
  }

  async register(registerAuthDto: RegisterAuthDto): Promise<UserId> {
    const { email, password, firstname, lastname, birthdate } = registerAuthDto
    const existingUser = await this.userService.getByEmail(email)
    if (existingUser) {
      throw new AuthException(AuthMessageException.USER_WITH_EMAIL_ALREADY_EXISTS)
    }

    try {
      //todo auth: create user here with User.new()
      // then save it with repository. Do not pass the dto to the repository
      const user = await this.userService.create({
        email,
        password: await Hash.make(password),
        firstname,
        lastname,
        birthdate,
      })
      return user.userId
    } catch (error) {
      console.error('Registration Error:', error)
      throw new AuthException(AuthMessageException.REGISTRATION_FAILED)
    }
  }
}
