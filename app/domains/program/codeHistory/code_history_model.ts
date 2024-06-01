import { Program, ProgramId } from '#domains/program/program_model'

export type CodeHistoryId = string
import { randomUUID } from 'node:crypto'
import CodeHistoryEntity from '#infrastructure/orm/lucid/entities/code_history_entity'

export class CodeHistory {
  codeHistoryId: CodeHistoryId
  code: string
  createdAt: Date
  programId: ProgramId

  private constructor(id: string, code: string, createdAt: Date, programId: ProgramId) {
    this.codeHistoryId = id
    this.code = code
    this.createdAt = createdAt
    this.programId = programId
  }

  static new(program: Program) {
    return new CodeHistory(randomUUID(), program.code, new Date(), program.programId)
  }

  static fromPersistence(data: {
    codeHistoryId: CodeHistoryId
    code: string
    createdAt: Date
    programId: ProgramId
  }): CodeHistory {
    return new CodeHistory(data.codeHistoryId, data.code, data.createdAt, data.programId)
  }

  toEntity(): CodeHistoryEntity {
    const historyEntity = new CodeHistoryEntity()
    historyEntity.codeHistoryId = this.codeHistoryId
    historyEntity.code = this.code
    historyEntity.program_id = this.programId
    return historyEntity
  }
}
