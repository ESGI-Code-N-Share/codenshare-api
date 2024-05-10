import {DateTime} from 'luxon'
import {BaseModel, column} from '@adonisjs/lucid/orm'
import {Opaque} from '@poppinss/utils/types'
import {type UserId} from '#models/user'

export type ProgramId = Opaque<'programId', string>

export default class Program extends BaseModel {
  @column({ isPrimary: true })
  declare programId: ProgramId

  @column()
  declare name: string | null

  @column()
  declare description: string | null

  @column()
  declare pictureName: string | null

  @column()
  declare language: string | null

  @column()
  declare visibility: 'public' | 'private' | 'protected'

  @column()
  declare code: string | null

  @column()
  declare authorId: UserId

  @column()
  declare originalAuthorId: UserId

  @column()
  declare online: boolean | null

  @column()
  declare status: 'active' | 'inactive' | 'archived' | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
