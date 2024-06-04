import Post, { type PostId } from '#domains/posts/post_model'
import { CreatePostDto } from '#domains/posts/post_dto'
import { UserRepositoryImpl } from '#infrastructure/orm/lucid/repositories/user_repository_impl'
import { PostException, PostMessageException } from '#domains/posts/post_exception'
import { PostRepositoryImpl } from '#infrastructure/orm/lucid/repositories/post_repository_impl'
import { inject } from '@adonisjs/core'
import { UserId } from '#domains/users/user_model'

@inject()
export class PostService {
  constructor(
    private readonly postRepository: PostRepositoryImpl,
    private readonly userRepository: UserRepositoryImpl
  ) {
    this.postRepository = postRepository
  }

  async getAll(): Promise<Post[]> {
    return this.postRepository.getAll()
  }

  async getByUser(userId: UserId): Promise<Post[]> {
    return this.postRepository.getByUser(userId)
  }

  async getById(postId: PostId): Promise<Post> {
    try {
      return await this.postRepository.getById(postId)
    } catch (error) {
      throw new PostException(PostMessageException.POST_NOT_FOUND)
    }
  }

  async create(postDto: CreatePostDto): Promise<Post> {
    const user = await this.userRepository.getById(postDto.authorId)
    const post = Post.new(postDto.title, postDto.content, user, postDto.image)
    return this.postRepository.create(post)
  }

  async delete(postId: PostId): Promise<PostId> {
    const post = await this.getById(postId)
    return this.postRepository.delete(post.postId)
  }
}
