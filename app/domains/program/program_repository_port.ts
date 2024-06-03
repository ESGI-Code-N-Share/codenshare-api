import { User } from '#domains/users/user_model'
import { Program, ProgramId } from '#domains/program/program_model'
import ProgramEntity from '#infrastructure/orm/lucid/entities/program_entity'

export interface ProgramRepositoryPort {
  getById(id: string): Promise<Program>
  getProgramsByUser(user: User): Promise<Program[]>
  getProgramsByName(name: string): Promise<Program[]>
  getProgramsByDescription(description: string): Promise<Program[]>
  create(programEntity: ProgramEntity): Promise<ProgramId>
  update(programEntity: ProgramEntity): Promise<void>

  delete(id: ProgramId): Promise<ProgramId>
}
