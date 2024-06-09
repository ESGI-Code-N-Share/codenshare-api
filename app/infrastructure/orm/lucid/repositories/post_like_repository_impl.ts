import { PostLikeRepositoryPort } from '#domains/posts/post_like/post_like_repository'
import { PostLike, PostLikeId } from '#domains/posts/post_like/post_like_model'
import { PostLikeEntity } from '#infrastructure/orm/lucid/entities/post_like_entity'
import { PostId } from '#domains/posts/post_model'
import { UserId } from '#domains/users/user_model'

export class PostLikeRepositoryImpl implements PostLikeRepositoryPort {
  constructor() {}

  async isPostLiked(postId: PostId, userId: UserId): Promise<boolean> {
    const postLike = await PostLikeEntity.query()
      .where('postId', postId)
      .where('userId', userId)
      .first()
    return !!postLike
  }

  async getByPostAndUser(postId: PostId, userId: UserId): Promise<PostLike> {
    const postLike = await PostLikeEntity.query()
      .where('postId', postId)
      .where('userId', userId)
      .firstOrFail()
    return postLike.toDomain()
  }

  async create(postLike: PostLike): Promise<PostLikeId> {
    const newPostLike = await PostLikeEntity.create({
      postLikeId: postLike.postLikeId,
      postId: postLike.postId,
      userId: postLike.userId,
    })
    return newPostLike.postLikeId
  }

  async delete(postLikeId: PostLikeId): Promise<PostLikeId> {
    const postLike = await PostLikeEntity.findOrFail(postLikeId)
    await postLike.delete()
    return postLikeId
  }
}
