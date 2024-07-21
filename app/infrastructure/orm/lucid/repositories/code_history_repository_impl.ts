import { CodeHistoryRepositoryPort } from '#domains/program/codeHistory/code_history_repository_port'
import CodeHistoryEntity from '#infrastructure/orm/lucid/entities/code_history_entity'

export class CodeHistoryRepositoryImpl implements CodeHistoryRepositoryPort {
  async getLastByProgramId(programId: string): Promise<CodeHistoryEntity | null> {
    return CodeHistoryEntity.query()
      .where('program_id', programId)
      .orderBy('created_at', 'desc')
      .first()
  }

  async create(codeHistoryEntity: CodeHistoryEntity): Promise<void> {
    await CodeHistoryEntity.create(codeHistoryEntity)
  }
}
