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

  async getFollowersByUser({ request, response }: HttpContext) {
    try {
      const userId = request.qs().userId
      const followers = await this.friendService.getFollowersByUser(userId)
      return response.send({ data: followers })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async getFollowingByUser({ request, response }: HttpContext) {
    try {
      const userId = request.qs().userId
      const following = await this.friendService.getFollowingByUser(userId)
      return response.send({ data: following })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async create({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const validFriend = await createFriendValidator.validate(data)
      const friendCreateDto: CreateFriendDto = {
        followerId: validFriend.followerId,
        followedId: validFriend.followedId,
      }
      const friend = await this.friendService.follow(friendCreateDto)
      return response.status(201).send({ data: friend })
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
      const friendId = await this.friendService.unfollow(
        friendDeleteDto.followerId,
        friendDeleteDto.followedId
      )
      return response.status(204).send({ data: friendId })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }
}
