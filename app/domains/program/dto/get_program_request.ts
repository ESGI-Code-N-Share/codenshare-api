import { CodeHistory } from '#domains/program/codeHistory/code_history_model'

export interface GetProgramRequest {
  id: string
  name: string
  description: string
  imageURL: string
  visibility: string
  authorName: string
  authorLastName: string
  authorMail: string
  codeHistories: CodeHistory[]
}
