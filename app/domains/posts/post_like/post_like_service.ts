import { PostLikeRepositoryImpl } from '#infrastructure/orm/lucid/repositories/post_like_repository_impl'
import { PostService } from '#domains/posts/post_service'
import { PostLike, PostLikeId } from '#domains/posts/post_like/post_like_model'
import { UserService } from '#domains/users/user_service'
import { CreatePostLikeDto, DeletePostLikeDto } from '#domains/posts/post_like/post_like_dto'
import { inject } from '@adonisjs/core'
import {
  PostLikeException,
  PostLikeMessageException,
} from '#domains/posts/post_like/post_like_exception'

@inject()
export class PostLikeService {
  constructor(
    private readonly postLikeRepository: PostLikeRepositoryImpl,
    private readonly postService: PostService,
    private readonly userService: UserService
  ) {
    this.postLikeRepository = postLikeRepository
    this.postService = postService
  }

  async likePost(createPostLikeDto: CreatePostLikeDto): Promise<PostLikeId> {
    const { postId, userId } = createPostLikeDto
    const post = await this.postService.getById(postId)
    const user = await this.userService.getById(userId)
    if (await this.postLikeRepository.isPostLiked(post.postId, user.userId)) {
      throw new PostLikeException(PostLikeMessageException.ALREADY_LIKED)
    }

    const postLike = PostLike.new(post.postId, user.userId)
    await this.postLikeRepository.create(postLike)
    return postLike.postLikeId
  }

  async unlikePost(deletePostLikeDto: DeletePostLikeDto): Promise<PostLikeId> {
    const { postId, userId } = deletePostLikeDto
    const post = await this.postService.getById(postId)
    const user = await this.userService.getById(userId)
    try {
      const postLike = await this.postLikeRepository.getByPostAndUser(post.postId, user.userId)
      await this.postLikeRepository.delete(postLike.postLikeId)
      return postLike.postLikeId
    } catch (e) {
      console.error(e)
      throw new PostLikeException(PostLikeMessageException.NOT_LIKED)
    }
  }
}
