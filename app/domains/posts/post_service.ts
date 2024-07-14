import Post, { type PostId } from '#domains/posts/post_model'
import { CreatePostDto } from '#domains/posts/post_dto'
import { PostException, PostMessageException } from '#domains/posts/post_exception'
import { PostRepositoryImpl } from '#infrastructure/orm/lucid/repositories/post_repository_impl'
import { UserService } from '#domains/users/user_service'
import { inject } from '@adonisjs/core'
import { UserId } from '#domains/users/user_model'
import { ProgramException, ProgramMessageException } from '#domains/program/program_exceptions'
import { ProgramService } from '#domains/program/program_service'

@inject()
export class PostService {
  constructor(
    private readonly postRepository: PostRepositoryImpl,
    private readonly userService: UserService,
    private readonly programService: ProgramService
  ) {
    this.postRepository = postRepository
    this.userService = userService
    this.programService = programService
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
    if (!postDto.authorId || !postDto.title || !postDto.content) {
      throw new PostException(PostMessageException.INVALID_PAYLOAD)
    }

    if (postDto.programId) {
      await this.programService.getProgram(postDto.programId)
    }

    const user = await this.userService.getById(postDto.authorId)
    const post = Post.new(postDto.title, postDto.content, user, postDto.image, postDto.programId)
    return this.postRepository.create(post)
  }

  async isPostAuthor(postId: PostId, userId: UserId): Promise<boolean> {
    const program = await this.postRepository.getById(postId)
    const user = await this.userService.getById(userId)
    return program.author.userId === userId || user.role === 'admin'
  }

  async delete(postId: PostId, userId: UserId): Promise<PostId> {
    const post = await this.getById(postId)
    const isAuthor = await this.isPostAuthor(postId, userId)
    if (!isAuthor) {
      throw new PostException(PostMessageException.PERMISSION_DENIED)
    }
    return this.postRepository.delete(post.postId)
  }
}
