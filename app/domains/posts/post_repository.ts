import Post, { type PostId } from '#domains/posts/post_model'

export interface PostRepositoryPort {
  getAll(): Promise<Post[]>

  getById(postId: PostId): Promise<Post>

  create(post: Post): Promise<Post>

  delete(postId: PostId): Promise<PostId>
}
