import { PostId } from '#domains/posts/post_model'
import { UserId } from '#domains/users/user_model'

export interface CreatePostLikeDto {
  postId: PostId
  userId: UserId
}

export interface DeletePostLikeDto {
  postId: PostId
  userId: UserId
}
