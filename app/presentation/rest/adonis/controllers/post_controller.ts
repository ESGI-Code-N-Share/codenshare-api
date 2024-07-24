import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PostService } from '#domains/posts/post_service'
import {
  createPostValidator,
  postValidator,
} from '#presentation/rest/adonis/controllers/post_validator'
import { CreatePostDto } from '#domains/posts/post_dto'

@inject()
export default class PostController {
  constructor(private readonly postService: PostService) {
    this.postService = postService
  }

  async list({ response, request }: HttpContext) {
    try {
      const queries = request.qs()
      if (queries.userId) {
        const posts = await this.postService.getByUser(queries.userId)
        return response.json({ data: posts })
      }
      const posts = await this.postService.getAll()
      return response.json({ data: posts })
    } catch (e) {
      console.error(e)
      return response.badGateway({ message: e.message })
    }
  }

  async find({ params, response }: HttpContext) {
    try {
      const post = await this.postService.getById(params.postId)
      return response.json({ data: post })
    } catch (e) {
      console.error(e)
      return response.status(404).json({ data: e.message })
    }
  }

  async create({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const validPost = await createPostValidator.validate(data)
      const postCreateDto: CreatePostDto = {
        title: validPost.title,
        content: validPost.content,
        authorId: validPost.authorId,
        image: validPost.image,
        programId: validPost.programId,
      }
      const post = await this.postService.create(postCreateDto)
      return response.status(201).json({ data: { postId: post.postId } })
    } catch (e) {
      console.error(e)
      return response.badGateway({ message: e.message })
    }
  }

  async delete({ params, response, request }: HttpContext) {
    try {
      const validProgram = await postValidator.validate(request.all())
      const postId = await this.postService.delete(params.postId, validProgram.userId)
      return response.status(200).json({ data: postId })
    } catch (e) {
      console.error(e)
      return response.status(404).json({ message: e.message })
    }
  }
}
