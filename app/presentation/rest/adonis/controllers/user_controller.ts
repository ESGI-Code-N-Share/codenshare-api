import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { UserService } from '#domains/users/user_service'
import { SearchUserDto } from '#domains/users/user_dto'
import { searchUserValidator } from '#presentation/rest/adonis/controllers/user_validtor'

@inject()
export default class UserController {
  constructor(private readonly userService: UserService) {
    this.userService = userService
  }

  async search({ request, response }: HttpContext) {
    try {
      const validQuery = await searchUserValidator.validate(request.qs())
      const searchUserDto: SearchUserDto = {
        query: validQuery.query,
      }
      const users = await this.userService.search(searchUserDto)
      return response.status(200).json(users)
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async find({ response, params }: HttpContext) {
    try {
      const user = await this.userService.getById(params.userId)
      return response.status(200).send(user)
    } catch (e) {
      console.error(e)
      return response.status(404)
    }
  }

  async delete({ response, params }: HttpContext) {
    try {
      await this.userService.delete(params.userId)
      return response.status(204)
    } catch (e) {
      console.error(e)
      return response.status(404)
    }
  }
}
