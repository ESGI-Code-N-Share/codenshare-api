import { User } from '#domains/users/user_model'
import { randomUUID } from 'node:crypto'
import { PostLike } from '#domains/posts/post_like/post_like_model'

export type PostId = string

export default class Post {
  postId: PostId
  title: string
  content: string
  image?: string
  author: User
  likes: PostLike[]
  postedAt: Date

  private constructor(
    postId: PostId,
    title: string,
    content: string,
    author: User,
    postedAt: Date,
    postLikes: PostLike[],
    image?: string
  ) {
    this.postId = postId
    this.title = title
    this.content = content
    this.image = image
    this.author = author
    this.likes = postLikes
    this.postedAt = postedAt
  }

  static new(
    title: string,
    content: string,
    author: User,
    image?: string,
    postedAt: Date = new Date()
  ): Post {
    return new Post(randomUUID(), title, content, author, postedAt, [], image)
  }

  static fromPersistence(data: {
    postId: PostId
    title: string
    content: string
    author: User
    postedAt: Date
    likes: PostLike[]
    image?: string
  }): Post {
    return new Post(
      data.postId,
      data.title,
      data.content,
      data.author,
      data.postedAt,
      data.likes,
      data.image
    )
  }
}
