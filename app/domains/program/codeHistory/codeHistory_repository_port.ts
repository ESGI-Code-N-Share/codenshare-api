import CodeHistoryEntity from '#infrastructure/orm/lucid/entities/codeHistory_entity'

export interface CodeHistoryRepositoryPort {
  create(codeHistory: CodeHistoryEntity): Promise<void>
}
