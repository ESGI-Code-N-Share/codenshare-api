import { CodeHistory } from '#domains/program/codeHistory/code_history_model'

export interface GetProgramRequest {
  programId: string
  name: string
  description: string
  code: string
  imageURL: string
  visibility: string
  language: string
  version?: string
  authorId: string
  authorName: string
  authorLastName: string
  authorMail: string
  instructions: {
    inputs: { name: string; type: string }[]
    outputs: { name: string; type: string }[]
  }
  codeHistories: CodeHistory[]
}
