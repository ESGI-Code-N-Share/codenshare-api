import CodeHistoryEntity from '#infrastructure/orm/lucid/entities/code_history_entity'

export interface CodeHistoryRepositoryPort {
  create(codeHistory: CodeHistoryEntity): Promise<void>
}
