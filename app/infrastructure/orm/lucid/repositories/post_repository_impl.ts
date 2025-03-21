import { PostRepositoryPort } from '#domains/posts/post_repository'
import PostEntity from '#infrastructure/orm/lucid/entities/post_entity'
import Post, { type PostId } from '#domains/posts/post_model'
import { DateTime } from 'luxon'

export class PostRepositoryImpl implements PostRepositoryPort {
  constructor() {}

  async getAll(): Promise<Post[]> {
    const posts = await PostEntity.query()
      .preload('author')
      .preload('likes')
      .whereNull('deletedAt')
      .orderBy('posted_at', 'desc')
    return posts.map((post) => post.toDomain())
  }

  async getByUser(userId: string): Promise<Post[]> {
    const posts = await PostEntity.query()
      .preload('author')
      .preload('likes')
      .where('authorId', userId)
      .whereNull('deletedAt')
      .orderBy('posted_at', 'desc')
    return posts.map((post) => post.toDomain())
  }

  async getById(postId: string): Promise<Post> {
    const post = await PostEntity.query()
      .preload('author')
      .preload('likes')
      .where('postId', postId)
      .whereNull('deletedAt')
      .firstOrFail()
    return post.toDomain()
  }

  async create(post: Post): Promise<Post> {
    const newPost = await PostEntity.create({
      postId: post.postId,
      title: post.title,
      content: post.content,
      authorId: post.author.userId,
      image: post.image,
      programId: post.programId,
    })
    const savedPost = await PostEntity.query()
      .where('postId', newPost.postId)
      .preload('author')
      .preload('likes')
      .firstOrFail()
    return savedPost.toDomain()
  }

  async delete(postId: PostId): Promise<PostId> {
    const post = await PostEntity.findOrFail(postId)
    post.deletedAt = DateTime.now()
    await post.save()
    return post.postId
  }
}
