import { DateTime } from 'luxon'
import { type ProgramId } from '#domains/program/program_model'
import { column, BaseModel } from '@adonisjs/lucid/orm'
import { CodeHistory, type CodeHistoryId } from '#domains/program/codeHistory/code_history_model'

export default class CodeHistoryEntity extends BaseModel {
  static table = 'code_histories'

  @column({ isPrimary: true, columnName: 'codeHistory_id' })
  declare codeHistoryId: CodeHistoryId

  @column()
  declare code: string

  @column()
  declare program_id: ProgramId

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  toDomain(): CodeHistory {
    return CodeHistory.fromPersistence({
      codeHistoryId: this.codeHistoryId,
      code: this.code,
      createdAt: this.createdAt.toJSDate(),
      programId: this.program_id,
    })
  }
}
