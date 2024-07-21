import { User } from '#domains/users/user_model'
import Mail from '@adonisjs/mail/services/main'

export class EmailService {
  static async sendVerificationEmail(user: User, host: string, protocol: string) {
    const fullUrl = `${protocol}://${host}/api/v1/verify-email/${user.userId}`

    try {
      await Mail.send((message) => {
        message
          .from('no-reply@codenshare.fr')
          .to(user.email)
          .subject('Email Verification')
          .html(
            `<p>Hello ${user.firstname},</p>
             <p>Verify your email by clicking the link below:</p>
             <p><a href="${fullUrl}">Verify Email</a></p>`
          )
      })
      console.log('Email sent successfully')
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }
}
