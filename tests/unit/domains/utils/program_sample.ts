import { Program, ProgramLanguages, ProgramVisibility } from '#domains/program/program_model'
import { UserSample } from '#tests/unit/domains/utils/user_sample'
import { CodeHistorySample } from '#tests/unit/domains/utils/code_history_sample'

export class ProgramSample {
  static new(programData: Partial<Program>): Program {
    // @ts-ignore
    return {
      programId: programData.programId ?? '1',
      name: programData.name ?? 'Program Name',
      code: programData.code ?? 'Code',
      description: programData.description ?? 'Description',
      pictureName: programData.pictureName ?? 'picture.png',
      language: programData.language ?? ('javascript' as ProgramLanguages),
      programVisibility: programData.programVisibility ?? ('public' as ProgramVisibility),
      originalAuthor: programData.originalAuthor ?? UserSample.new({}),
      author: programData.author ?? UserSample.new({}),
      codeHistories: programData.codeHistories ?? [
        CodeHistorySample.new({}),
        CodeHistorySample.new({}),
      ],
    }
  }
}
