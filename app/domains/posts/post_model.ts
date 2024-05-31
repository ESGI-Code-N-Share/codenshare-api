import { User } from '#domains/users/user_model'
import { randomUUID } from 'node:crypto'

export type PostId = string

export default class Post {
  postId: PostId
  title: string
  content: string
  image?: string
  author: User
  postedAt: Date

  private constructor(
    postId: PostId,
    title: string,
    content: string,
    author: User,
    postedAt: Date,
    image?: string
  ) {
    this.postId = postId
    this.title = title
    this.content = content
    this.image = image
    this.author = author
    this.postedAt = postedAt
  }

  static new(
    title: string,
    content: string,
    author: User,
    image?: string,
    postedAt: Date = new Date()
  ): Post {
    return new Post(randomUUID(), title, content, author, postedAt, image)
  }

  static fromPersistence(data: {
    postId: PostId
    title: string
    content: string
    author: User
    postedAt: Date
    image?: string
  }): Post {
    return new Post(data.postId, data.title, data.content, data.author, data.postedAt, data.image)
  }
}
