import { ProgramRepositoryPort } from '#domains/program/program_repository_port'
import { User } from '#domains/users/user_model'
import { Program, ProgramId } from '#domains/program/program_model'
import ProgramEntity from '../entities/program_entity.js'
import { DateTime } from 'luxon'

export class ProgramRepositoryImpl implements ProgramRepositoryPort {
  async create(programEntity: ProgramEntity): Promise<ProgramId> {
    await ProgramEntity.create(programEntity)
    return programEntity.programId
  }

  async delete(id: ProgramId): Promise<ProgramId> {
    const program = await ProgramEntity.findOrFail(id)
    program.deletedAt = DateTime.now()
    await program.save()
    return id
  }

  async getById(id: ProgramId): Promise<Program> {
    const program = await ProgramEntity.query()
      .where('programId', id)
      .whereNull('deletedAt')
      .preload('author')
      .preload('originalAuthor')
      .preload('codeHistories')
      .firstOrFail()

    return program.toDomain()
  }

  async getProgramsByUser(user: User): Promise<Program[]> {
    const programs = await ProgramEntity.query()
      .where('original_author_id', user.userId)
      .whereNull('deletedAt')
      .preload('author')
      .preload('originalAuthor')
      .preload('codeHistories')

    return programs.map((program) => program.toDomain())
  }

  async update(programUpdated: ProgramEntity): Promise<void> {
    let program = await ProgramEntity.findOrFail(programUpdated.programId)

    program.name = programUpdated.name
    program.code = programUpdated.code
    program.description = programUpdated.description
    program.language = programUpdated.language
    program.visibility = programUpdated.visibility
    program.pictureName = programUpdated.pictureName
    program.author_id = programUpdated.author_id
    program.updatedAt = DateTime.now()

    await program.save()
  }

  async getProgramsByDescription(description: string): Promise<Program[]> {
    const programs = await ProgramEntity.query()
      .where('description', 'ILIKE', `%${description}%`)
      .andWhere('visibility', '!=', 'private')
      .andWhereNull('deletedAt')
      .preload('author')
      .preload('originalAuthor')
      .preload('codeHistories')

    return programs.map((program) => program.toDomain())
  }

  async getProgramsByName(name: string): Promise<Program[]> {
    const programs = await ProgramEntity.query()
      .where('name', 'ILIKE', `%${name}%`)
      .andWhere('visibility', '!=', 'private')
      .andWhereNull('deletedAt')
      .preload('author')
      .preload('originalAuthor')
      .preload('codeHistories')

    return programs.map((program) => program.toDomain())
  }
}
