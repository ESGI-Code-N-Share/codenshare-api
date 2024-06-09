import { PostLike, PostLikeId } from '#domains/posts/post_like/post_like_model'
import { PostId } from '#domains/posts/post_model'
import { UserId } from '#domains/users/user_model'

export interface PostLikeRepositoryPort {
  isPostLiked(postId: PostId, userId: UserId): Promise<boolean>

  getByPostAndUser(postId: PostId, userId: UserId): Promise<PostLike>

  create(postLike: PostLike): Promise<PostLikeId>

  delete(postLikeId: PostLikeId): Promise<PostLikeId>
}
