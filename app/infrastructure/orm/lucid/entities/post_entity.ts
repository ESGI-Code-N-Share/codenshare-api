import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Post, { type PostId } from '#domains/posts/post_model'
import { type UserId } from '#domains/users/user_model'
import UserEntity from './user_entity.js'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { PostLikeEntity } from '#infrastructure/orm/lucid/entities/post_like_entity'

export default class PostEntity extends BaseModel {
  static table = 'posts'

  @column({ isPrimary: true })
  declare postId: PostId

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare image?: string

  @column()
  declare authorId: UserId

  @hasMany(() => PostLikeEntity, {
    foreignKey: 'postId',
  })
  declare likes: HasMany<typeof PostLikeEntity>

  @belongsTo(() => UserEntity, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof UserEntity>

  @column.dateTime({ autoCreate: true })
  declare postedAt: DateTime

  @column.dateTime()
  declare deletedAt?: DateTime

  toDomain(): Post {
    return Post.fromPersistence({
      postId: this.postId,
      title: this.title,
      content: this.content,
      author: this.author.toDomain(),
      postedAt: this.postedAt.toJSDate(),
      likes: this.likes.map((like) => like.toDomain()),
      image: this.image,
    })
  }
}
