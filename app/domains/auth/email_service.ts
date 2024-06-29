import { User } from '#domains/users/user_model'
import Mail from '@adonisjs/mail/services/main'
import env from '#start/env'

export class EmailService {
  static async sendVerificationEmail(user: User) {
    const host = env.get('HOST')
    const port = env.get('PORT')
    const verifyUrl = `http://${host}:${port}/api/v1/verify-email/${user.userId}`
    try {
      await Mail.send((message) => {
        message
          .from('no-reply@codenshare.fr')
          .to(user.email)
          .subject('Email Verification')
          .html(
            `<p>Hello ${user.firstname},</p><p>verify your email</p><p><a href="${verifyUrl}">Verify Email</a></p>`
          )
      })
      console.log('Email sent successfully')
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}
