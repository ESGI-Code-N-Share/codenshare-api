import { UserId } from '#domains/users/user_model'
import { ProgramId, ProgramVisibility } from '#domains/program/program_model'
import { GetProgramRequest } from '#domains/program/dto/get_program_request'
import { GetProgramsRequest } from '#domains/program/dto/get_programs_by_user_request'

export interface ProgramServicePort {
  getProgram(id: ProgramId): Promise<GetProgramRequest>
  getAllByUser(userId: UserId): Promise<GetProgramsRequest[]>
  search(content: string): Promise<GetProgramsRequest[]>
  createDefault(userId: UserId): Promise<void>
  update(
    id: ProgramId,
    name: string,
    description: string,
    pictureName: string,
    code: string,
    language: string,
    visibility: ProgramVisibility,
    userId: UserId
  ): Promise<void>
  delete(id: ProgramId, userId: UserId): Promise<void>
  import(id: ProgramId, userId: UserId): Promise<void>
}
