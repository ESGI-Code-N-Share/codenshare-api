import { Program } from '#domains/program/program_model'
import { inject } from '@adonisjs/core'
import { CodeHistory, CodeHistoryId } from '#domains/program/codeHistory/code_history_model'
import { CodeHistoryRepositoryImpl } from '#infrastructure/orm/lucid/repositories/code_history_repository_impl'

@inject()
export class CodeHistoryService {
  constructor(private readonly codeHistoryRepository: CodeHistoryRepositoryImpl) {
    this.codeHistoryRepository = codeHistoryRepository
  }

  async create(program: Program): Promise<CodeHistoryId> {
    const codeHistory: CodeHistory = CodeHistory.new(program)
    await this.codeHistoryRepository.create(codeHistory.toEntity())
    return codeHistory.codeHistoryId
  }
}
