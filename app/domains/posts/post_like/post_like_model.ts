import { PostId } from '#domains/posts/post_model'
import { UserId } from '#domains/users/user_model'
import { randomUUID } from 'node:crypto'

export type PostLikeId = string

export class PostLike {
  postLikeId: PostLikeId
  postId: PostId
  userId: UserId
  likedAt: Date

  private constructor(postLikeId: PostLikeId, postId: PostId, userId: UserId, likedAt: Date) {
    this.postLikeId = postLikeId
    this.postId = postId
    this.userId = userId
    this.likedAt = likedAt
  }

  static new(postId: PostId, userId: UserId) {
    return new PostLike(randomUUID(), postId, userId, new Date())
  }

  static fromPersistence(data: {
    postLikeId: PostLikeId
    postId: PostId
    userId: UserId
    likedAt: Date
  }) {
    return new PostLike(data.postLikeId, data.postId, data.userId, data.likedAt)
  }
}
