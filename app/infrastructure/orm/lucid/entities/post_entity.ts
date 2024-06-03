import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Post, { type PostId } from '#domains/posts/post_model'
import { type UserId } from '#domains/users/user_model'
import UserEntity from './user_entity.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

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
      image: this.image,
    })
  }
}
