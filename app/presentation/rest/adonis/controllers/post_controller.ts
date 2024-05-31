import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PostService } from '#domains/posts/post_service'
import { createPostValidator } from '#presentation/rest/adonis/controllers/post_validator'
import { CreatePostDto } from '#domains/posts/post_dto'

@inject()
export default class PostController {
  constructor(private readonly postService: PostService) {
    this.postService = postService
  }

  async list({ response }: HttpContext) {
    try {
      const posts = await this.postService.getAll()
      return response.json(posts)
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: e.message || e.code })
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
      }
      const post = await this.postService.create(postCreateDto)
      return response.status(201).json({ data: { postId: post.postId } })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message || e.code })
    }
  }

  async delete({ params, response }: HttpContext) {
    try {
      await this.postService.delete(params.postId)
      return response.status(204)
    } catch (e) {
      console.error(e)
      return response.status(404).send({ message: e.message || e.code })
    }
  }
}
