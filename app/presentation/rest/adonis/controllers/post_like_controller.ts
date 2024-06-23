import { PostLikeService } from '#domains/posts/post_like/post_like_service'
import { HttpContext } from '@adonisjs/core/http'
import {
  postLikeCreateValidator,
  postLikeDeleteValidator,
} from '#presentation/rest/adonis/controllers/post_like_validator'
import { CreatePostLikeDto, DeletePostLikeDto } from '#domains/posts/post_like/post_like_dto'
import { inject } from '@adonisjs/core'

@inject()
export default class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {
    this.postLikeService = postLikeService
  }

  async create({ request, response, params }: HttpContext) {
    try {
      const data = { ...request.all(), ...params }
      const validCreate = await postLikeCreateValidator.validate(data)
      const createPostLikeDto: CreatePostLikeDto = {
        postId: validCreate.postId,
        userId: validCreate.userId,
      }
      const postLikeId = await this.postLikeService.likePost(createPostLikeDto)
      return response.created({ data: postLikeId })
    } catch (e) {
      console.error(e)
      return response.badRequest({ message: e.message })
    }
  }

  async delete({ request, response, params }: HttpContext) {
    try {
      const data = { ...request.all(), ...params }
      const validDelete = await postLikeDeleteValidator.validate(data)
      const deletePostLikeDto: DeletePostLikeDto = {
        postId: validDelete.postId,
        userId: validDelete.userId,
      }
      const postLikeId = await this.postLikeService.unlikePost(deletePostLikeDto)
      return response.ok({ data: postLikeId })
    } catch (e) {
      console.error(e)
      return response.badRequest({ message: e.message })
    }
  }
}
