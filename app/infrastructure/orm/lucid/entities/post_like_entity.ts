import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { PostLike } from '#domains/posts/post_like/post_like_model'

export class PostLikeEntity extends BaseModel {
  static table = 'post_like'

  @column({ isPrimary: true })
  declare postLikeId: string

  @column()
  declare postId: string

  @column()
  declare userId: string

  @column.dateTime({ autoCreate: true })
  declare liked_at: DateTime

  toDomain(): PostLike {
    return PostLike.fromPersistence({
      postLikeId: this.postLikeId,
      postId: this.postId,
      userId: this.userId,
      likedAt: this.liked_at.toJSDate(),
    })
  }
}
