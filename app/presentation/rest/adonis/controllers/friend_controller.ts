import { inject } from '@adonisjs/core'
import { FriendService } from '#domains/friends/friend_service'
import { HttpContext } from '@adonisjs/core/http'
import { CreateFriendDto } from '#domains/friends/friend_dto'
import {
  createFriendValidator,
  deleteFriendValidator,
} from '#presentation/rest/adonis/controllers/friend_validator'

@inject()
export default class FriendController {
  constructor(private readonly friendService: FriendService) {
    this.friendService = friendService
  }

  async create({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const validFriend = await createFriendValidator.validate(data)
      const friendCreateDto: CreateFriendDto = {
        followerId: validFriend.followerId,
        followedId: validFriend.followedId,
      }
      await this.friendService.follow(friendCreateDto)
      return response.status(201)
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async delete({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const validFriend = await deleteFriendValidator.validate(data)
      const friendDeleteDto: CreateFriendDto = {
        followerId: validFriend.followerId,
        followedId: validFriend.followedId,
      }
      await this.friendService.unfollow(friendDeleteDto.followerId, friendDeleteDto.followedId)
      return response.status(204)
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }
}
