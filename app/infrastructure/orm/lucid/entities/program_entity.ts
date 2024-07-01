import { DateTime } from 'luxon'
import {
  Program,
  type ProgramId,
  type ProgramInstructions,
  type ProgramVisibility,
} from '#domains/program/program_model'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import UserEntity from './user_entity.js'
import type { UserId } from '#domains/users/user_model'
import CodeHistoryEntity from '#infrastructure/orm/lucid/entities/code_history_entity'

export default class ProgramEntity extends BaseModel {
  static table = 'programs'

  @column({ isPrimary: true })
  declare programId: ProgramId

  @column()
  declare name: string

  @column()
  declare description: string

  @column({ columnName: 'picture_name' })
  declare pictureName: string

  @column()
  declare code: string

  @column()
  declare language: string

  @column()
  declare visibility: ProgramVisibility

  @column()
  declare original_author_id: UserId

  @belongsTo(() => UserEntity, { foreignKey: 'original_author_id' })
  declare originalAuthor: BelongsTo<typeof UserEntity>

  @hasMany(() => CodeHistoryEntity, { foreignKey: 'program_id' })
  declare codeHistories: HasMany<typeof CodeHistoryEntity>

  @column()
  declare author_id: UserId

  @column()
  declare instructions: ProgramInstructions

  @belongsTo(() => UserEntity, { foreignKey: 'author_id' })
  declare author: BelongsTo<typeof UserEntity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare deletedAt?: DateTime

  toDomain(): Program {
    console.log(this.instructions)
    return Program.fromPersistence({
      programId: this.programId,
      name: this.name,
      description: this.description,
      code: this.code,
      pictureName: this.pictureName,
      language: this.language,
      programVisibility: this.visibility,
      originalAuthor: this.originalAuthor,
      author: this.author,
      codeHistories: this.codeHistories,
      instructions: this.instructions as ProgramInstructions,
    })
  }
}
