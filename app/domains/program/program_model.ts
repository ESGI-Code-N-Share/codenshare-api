import { User } from '#domains/users/user_model'

import { randomUUID } from 'node:crypto'
import ProgramEntity from '#infrastructure/orm/lucid/entities/program_entity'
import UserEntity from '#infrastructure/orm/lucid/entities/user_entity'
import CodeHistoryEntity from '#infrastructure/orm/lucid/entities/code_history_entity'
import { CodeHistory } from '#domains/program/codeHistory/code_history_model'
import { GetProgramRequest } from '#domains/program/dto/get_program_request'
import { GetProgramsRequest } from '#domains/program/dto/get_programs_by_user_request'

export type ProgramId = string
export type ProgramLanguages = 'c' | 'java' | 'javascript' | string
export type ProgramVisibility = 'public' | 'protected' | 'private'
export type ProgramInstructionsInput = { name: string; type: string }
export type ProgramInstructionsOutput = { name: string; type: string }
export type ProgramInstructions = {
  inputs: ProgramInstructionsInput[]
  outputs: ProgramInstructionsOutput[]
}

export class Program {
  programId: ProgramId
  name: string
  code: string
  description: string
  pictureName: string
  language: ProgramLanguages
  version: string
  programVisibility: ProgramVisibility
  author: User
  originalAuthor: User
  codeHistories: CodeHistory[]
  instructions: ProgramInstructions
  createdAt: Date

  constructor(
    id: ProgramId,
    name: string,
    description: string,
    code: string,
    pictureName: string,
    language: string,
    version: string,
    programVisibility: ProgramVisibility,
    originalAuthor: User,
    author: User,
    codeHistories: CodeHistory[],
    instructions: ProgramInstructions,
    createdAt: Date
  ) {
    this.programId = id
    this.name = name
    this.description = description
    this.code = code
    this.pictureName = pictureName
    this.language = language
    this.version = version
    this.programVisibility = programVisibility
    this.originalAuthor = originalAuthor
    this.author = author
    this.codeHistories = codeHistories
    this.instructions = instructions
    this.createdAt = createdAt
  }

  static new(
    name: string,
    description: string,
    code: string,
    pictureName: string,
    language: string,
    programVisibility: ProgramVisibility,
    originalAuthor: User,
    author: User,
    createdAt: Date
  ) {
    return new Program(
      randomUUID(),
      name,
      description,
      code,
      pictureName,
      language,
      '',
      programVisibility,
      originalAuthor,
      author,
      [],
      { inputs: [], outputs: [] },
      createdAt
    )
  }

  static default(
    pictureName: string,
    programVisibility: ProgramVisibility,
    originalAuthor: User,
    author: User
  ) {
    return new Program(
      randomUUID(),
      'Nouveau programme',
      '',
      '',
      pictureName,
      '',
      '',
      programVisibility,
      originalAuthor,
      author,
      [],
      { inputs: [], outputs: [] },
      new Date()
    )
  }

  static fromPersistence(data: {
    programId: ProgramId
    name: string
    description: string
    code: string
    pictureName: string
    language: string
    version: string
    programVisibility: ProgramVisibility
    originalAuthor: UserEntity
    author: UserEntity
    codeHistories: CodeHistoryEntity[]
    instructions: ProgramInstructions
    createdAt: Date
  }) {
    return new Program(
      data.programId,
      data.name,
      data.description,
      data.code,
      data.pictureName,
      data.language,
      data.version,
      data.programVisibility,
      data.originalAuthor.toDomain(),
      data.author.toDomain(),
      data.codeHistories.map((codeHistory) => codeHistory.toDomain()),
      data.instructions,
      data.createdAt
    )
  }

  toEntity(): ProgramEntity {
    const programEntity = new ProgramEntity()

    programEntity.programId = this.programId
    programEntity.name = this.name
    programEntity.code = this.code
    programEntity.description = this.description
    programEntity.language = this.language
    programEntity.version = this.version
    programEntity.visibility = this.programVisibility
    programEntity.pictureName = this.pictureName
    programEntity.author_id = this.author.userId
    programEntity.original_author_id = this.originalAuthor.userId
    programEntity.instructions = this.instructions

    return programEntity
  }

  toGetProgramsRequest(): GetProgramsRequest {
    return {
      programId: this.programId,
      name: this.name,
      description: this.description,
      imageURL: this.pictureName,
      authorId: this.author.userId,
      originalAuthorId: this.originalAuthor.userId,
      visibility: this.programVisibility.toString(),
      createdAt: this.createdAt.toISOString(),
      language: this.language,
    }
  }

  toGetProgramRequest(): GetProgramRequest {
    return {
      programId: this.programId,
      name: this.name,
      description: this.description,
      imageURL: this.pictureName,
      code: this.code,
      authorId: this.author.userId,
      language: this.language,
      version: this.version,
      visibility: this.programVisibility.toString(),
      authorName: this.author.firstname,
      authorLastName: this.author.lastname,
      authorMail: this.author.email,
      codeHistories: this.codeHistories,
      instructions: this.instructions,
    }
  }
}
