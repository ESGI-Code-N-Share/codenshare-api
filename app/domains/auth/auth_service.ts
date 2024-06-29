import { UserService } from '#domains/users/user_service'
import { inject } from '@adonisjs/core'
import { LoginAuthDto, RegisterAuthDto } from '#domains/auth/auth_dto'
import { User, UserId } from '#domains/users/user_model'
import { AuthException, AuthMessageException } from '#domains/auth/auth_exception'
import Hash from '@adonisjs/core/services/hash'
import JwtUtil from '#config/jwt'
import { UserException, UserMessageException } from '#domains/users/user_exception'
import { EmailService } from '#domains/auth/email_service'

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

    const tokenDuration = stayLogin ? '7d' : '15s'
    user.token = JwtUtil.generateToken({ id: user.userId, email: user.email }, tokenDuration)
    await this.userService.update(user)
    return user
  }

  async register(registerAuthDto: RegisterAuthDto): Promise<UserId> {
    const {
      email,
      password,
      firstname,
      lastname,
      birthdate,
      emailVerified = false,
    } = registerAuthDto
    const existingUser = await this.userService.getByEmail(email)
    if (existingUser) {
      throw new AuthException(AuthMessageException.USER_WITH_EMAIL_ALREADY_EXISTS)
    }

    const passwordHashed = await Hash.make(password)
    const photos = [
      'https://randomwordgenerator.com/img/picture-generator/55e4d5464f5ba914f1dc8460962e33791c3ad6e04e5074417d2d73dc934bcd_640.jpg',
      'https://randomwordgenerator.com/img/picture-generator/55e2dc454c5aaa14f1dc8460962e33791c3ad6e04e507441722872d59f4ac3_640.jpg',
      'https://randomwordgenerator.com/img/picture-generator/54e6d5464f52ae14f1dc8460962e33791c3ad6e04e50744172297cdc9e48c3_640.jpg'
    ]
    try {
      const newUser = User.new(
        firstname,
        lastname,
        email,
        birthdate,
        passwordHashed,
        photos[Math.floor(Math.random() * photos.length)],
        emailVerified
    )
      const createdUser = await this.userService.create(newUser)
      await EmailService.sendVerificationEmail(createdUser)
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

    user.token = null
    await this.userService.update(user)
  }

  async verifyEmail(userId: UserId): Promise<void> {
    const user = await this.userService.getById(userId)
    if (!user) {
      throw new UserException(UserMessageException.USER_NOT_FOUND)
    }

    if (user.emailVerified) {
      throw new UserException(UserMessageException.EMAIL_ALREADY_VERIFIED)
    }

    user.emailVerified = true
    await this.userService.update(user)
  }
}
