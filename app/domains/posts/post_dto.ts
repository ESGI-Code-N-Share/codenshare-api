import { type UserId } from '#domains/users/user_model'
import { type ProgramId } from '#domains/program/program_model'

export interface CreatePostDto {
  title: string
  content: string
  authorId: UserId
  image?: string
  programId?: ProgramId
}
