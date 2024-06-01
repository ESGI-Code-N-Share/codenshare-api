import { CodeHistoryRepositoryPort } from '#domains/program/codeHistory/codeHistory_repository_port'
import CodeHistoryEntity from '#infrastructure/orm/lucid/entities/codeHistory_entity'

export class CodeHistoryRepositoryImpl implements CodeHistoryRepositoryPort {
  async create(codeHistoryEntity: CodeHistoryEntity): Promise<void> {
    await CodeHistoryEntity.create(codeHistoryEntity)
  }
}
