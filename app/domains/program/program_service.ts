import { Program, ProgramId, ProgramVisibility } from '#domains/program/program_model'
import { UserService } from '#domains/users/user_service'
import { inject } from '@adonisjs/core'
import { User, UserId } from '#domains/users/user_model'
import { ProgramRepositoryImpl } from '#infrastructure/orm/lucid/repositories/program_repository_impl'
import { ProgramException, ProgramMessageException } from '#domains/program/program_exceptions'
import { ProgramServicePort } from '#domains/program/program_service_port'
import { GetProgramsRequest } from '#domains/program/dto/get_programs_by_user_request'
import { GetProgramRequest } from '#domains/program/dto/get_program_request'

@inject()
export class ProgramService implements ProgramServicePort {
  constructor(
    private readonly programRepository: ProgramRepositoryImpl,
    // private readonly codeHistoryService: CodeHistoryService,
    private readonly userService: UserService
  ) {
    this.programRepository = programRepository
    // this.codeHistoryService = codeHistoryService
    this.userService = userService
  }

  async getProgram(id: ProgramId): Promise<GetProgramRequest> {
    const program = await this.getById(id)
    return program.toGetProgramRequest()
  }

  async getAllByUser(userId: UserId): Promise<GetProgramsRequest[]> {
    const user: User = await this.userService.getById(userId)
    const programs = await this.programRepository.getProgramsByUser(user)

    return programs.map((program) => program.toGetProgramsRequest())
  }

  async search(content: string): Promise<GetProgramsRequest[]> {
    const programsByName = await this.programRepository.getProgramsByName(content)
    const programsByDescription = await this.programRepository.getProgramsByDescription(content)

    const uniquePrograms = new Set([...programsByName, ...programsByDescription])
    return Array.from(uniquePrograms).map((program) => program.toGetProgramsRequest())
  }

  async createDefault(userId: UserId): Promise<void> {
    const user: User = await this.userService.getById(userId)

    const defaultPictureName = 'default' // todo to change
    const newProgram = Program.default(defaultPictureName, 'private', user, user)

    await this.programRepository.create(newProgram.toEntity())
  }

  async update(
    id: ProgramId,
    name: string,
    description: string,
    pictureName: string,
    code: string,
    language: string,
    visibility: ProgramVisibility,
    userId: UserId
  ) {
    const editor = await this.userService.getById(userId)
    const program = await this.getById(id)

    if (
      program.programVisibility === 'private' &&
      program.originalAuthor.userId !== editor.userId
    ) {
      throw new ProgramException(ProgramMessageException.PERMISSION_DENIED)
    }

    if (
      program.programVisibility === 'protected' &&
      program.originalAuthor.userId !== editor.userId
    ) {
      throw new ProgramException(ProgramMessageException.PERMISSION_DENIED)
    }

    program.name = name
    program.code = code
    program.description = description
    program.pictureName = pictureName
    program.language = language
    program.programVisibility = visibility
    program.author = editor

    await this.programRepository.update(program.toEntity())
  }

  async delete(id: ProgramId, userId: UserId): Promise<void> {
    const user = await this.userService.getById(userId)
    const program = await this.getById(id)

    if (program.originalAuthor.userId !== userId && user.role !== 'admin') {
      throw new ProgramException(ProgramMessageException.PERMISSION_DENIED)
    }

    await this.programRepository.delete(id)
  }

  async import(id: ProgramId, userId: UserId): Promise<void> {
    const user = await this.userService.getById(userId)
    const program = await this.getById(id)

    if (program.programVisibility === 'private') {
      throw new ProgramException(ProgramMessageException.PERMISSION_DENIED)
    }

    const programImported = Program.new(
      program.name,
      program.description,
      program.code,
      program.pictureName,
      program.language,
      'private',
      program.originalAuthor,
      user
    )

    await this.programRepository.create(programImported.toEntity())
  }

  // execute(programId: ProgramId/*, userId: UserId*/): Promise<void> {
  // await this.codeHistoryService.create(program)
  // }

  private async getById(id: ProgramId): Promise<Program> {
    try {
      return await this.programRepository.getById(id)
    } catch (error) {
      throw new ProgramException(ProgramMessageException.NOT_FOUND)
    }
  }
}
