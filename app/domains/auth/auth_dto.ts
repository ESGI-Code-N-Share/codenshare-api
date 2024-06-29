export interface LoginAuthDto {
  email: string
  password: string
}

export interface RegisterAuthDto {
  firstname: string
  lastname: string
  email: string
  password: string
  birthdate: Date
  emailVerified: boolean
}

export interface PasswordRecoveryAuthDto {
  email: string
}

export interface PasswordResetAuthDto {
  token: string
  password: string
}
