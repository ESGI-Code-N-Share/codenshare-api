import Post, { type PostId } from '#domains/posts/post_model'
import { UserId } from '#domains/users/user_model'

export interface PostRepositoryPort {
  getAll(): Promise<Post[]>

  getByUser(userId: UserId): Promise<Post[]>

  getById(postId: PostId): Promise<Post>

  create(post: Post): Promise<Post>

  delete(postId: PostId): Promise<PostId>
}
