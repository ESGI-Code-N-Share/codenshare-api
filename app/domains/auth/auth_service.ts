import { UserService } from '#domains/users/user_service'
import { inject } from '@adonisjs/core'
import { LoginAuthDto, RegisterAuthDto } from '#domains/auth/auth_dto'
import { User, UserId } from '#domains/users/user_model'
import { AuthException, AuthMessageException } from '#domains/auth/auth_exception'
import Hash from '@adonisjs/core/services/hash'
import JwtUtil from '#config/jwt'
import { UserException, UserMessageException } from '#domains/users/user_exception'

@inject()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginAuthDto: LoginAuthDto, stayLogin: boolean): Promise<User> {
    const { email, password } = loginAuthDto
    const user = await this.userService.getByEmail(email)
    if (!user) {
      throw new AuthException(AuthMessageException.USER_WITH_CREDENTIALS_NOT_FOUND)
    }

    const isPasswordValid = await Hash.verify(user.password, password)
    if (!isPasswordValid) {
      throw new AuthException(AuthMessageException.USER_WITH_CREDENTIALS_NOT_FOUND)
    }

    const tokenDuration = stayLogin ? '7d' : '15m'
    user.token = JwtUtil.generateToken({ id: user.userId, email: user.email }, tokenDuration)
    await this.userService.update(user)
    return user
  }

  async register(registerAuthDto: RegisterAuthDto): Promise<UserId> {
    const { email, password, firstname, lastname, birthdate } = registerAuthDto
    const existingUser = await this.userService.getByEmail(email)
    if (existingUser) {
      throw new AuthException(AuthMessageException.USER_WITH_EMAIL_ALREADY_EXISTS)
    }

    const passwordHashed = await Hash.make(password)
    const defaultPictureName = `https://picsum.photos/536/${Math.floor(Math.random() * 536)}`
    try {
      const newUser = User.new(
        firstname,
        lastname,
        email,
        birthdate,
        passwordHashed,
        defaultPictureName
      )
      const createdUser = await this.userService.create(newUser)
      return createdUser.userId
    } catch (error) {
      console.error('Registration Error:', error)
      throw new AuthException(AuthMessageException.REGISTRATION_FAILED)
    }
  }

  async logout(userId: UserId): Promise<void> {
    const user = await this.userService.getById(userId)
    if (!user) {
      throw new UserException(UserMessageException.USER_NOT_FOUND)
    }

    user.token = ''
    await this.userService.update(user)
  }
}
