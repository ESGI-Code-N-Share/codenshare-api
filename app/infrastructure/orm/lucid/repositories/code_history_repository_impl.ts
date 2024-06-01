import { CodeHistoryRepositoryPort } from '#domains/program/codeHistory/code_history_repository_port'
import CodeHistoryEntity from '#infrastructure/orm/lucid/entities/code_history_entity'

export class CodeHistoryRepositoryImpl implements CodeHistoryRepositoryPort {
  async create(codeHistoryEntity: CodeHistoryEntity): Promise<void> {
    await CodeHistoryEntity.create(codeHistoryEntity)
  }
}
