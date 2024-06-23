import jwt from 'jsonwebtoken'
import env from '#start/env'

export interface TokenData {
  id: string
  email: string
}

export default class JwtUtil {
  private static readonly secret = env.get('JWT_SECRET_KEY')
  static readonly expirationTime = '7d'

  static generateToken(data: TokenData, expiresIn: string = this.expirationTime): string {
    return jwt.sign(data, this.secret, { expiresIn })
  }
}
