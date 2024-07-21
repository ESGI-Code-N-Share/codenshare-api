import CodeHistoryEntity from '#infrastructure/orm/lucid/entities/code_history_entity'

export interface CodeHistoryRepositoryPort {
  getLastByProgramId(programId: string): Promise<CodeHistoryEntity | null>
  create(codeHistory: CodeHistoryEntity): Promise<void>
}
