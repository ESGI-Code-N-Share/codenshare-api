import { CodeHistory } from '#domains/program/codeHistory/code_history_model'
import { ProgramSample } from '#tests/unit/domains/utils/program_sample'

export class CodeHistorySample {
  static new(codeHistoryData: Partial<CodeHistory>): CodeHistory {
    // @ts-ignore
    return {
      codeHistoryId: codeHistoryData.codeHistoryId ?? '1',
      code: codeHistoryData.code ?? 'Code',
      createdAt: codeHistoryData.createdAt ?? new Date(),
      programId: codeHistoryData.programId ?? ProgramSample.new({}).programId,
    }
  }
}
