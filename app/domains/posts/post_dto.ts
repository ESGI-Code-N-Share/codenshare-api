import { type UserId } from '#domains/users/user_model'

export interface CreatePostDto {
  title: string
  content: string
  authorId: UserId
  image?: string
}
