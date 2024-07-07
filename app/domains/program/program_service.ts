import {
  Program,
  ProgramId,
  ProgramInstructions,
  ProgramVisibility,
} from '#domains/program/program_model'
import { UserService } from '#domains/users/user_service'
import { inject } from '@adonisjs/core'
import { User, UserId } from '#domains/users/user_model'
import { ProgramRepositoryImpl } from '#infrastructure/orm/lucid/repositories/program_repository_impl'
import { ProgramException, ProgramMessageException } from '#domains/program/program_exceptions'
import { ProgramServicePort } from '#domains/program/program_service_port'
import { GetProgramsRequest } from '#domains/program/dto/get_programs_by_user_request'
import { GetProgramRequest } from '#domains/program/dto/get_program_request'
import { EdcService } from '#infrastructure/api/edc_service'
import { CodeHistoryService } from '#domains/program/codeHistory/code_history_service'

@inject()
export class ProgramService implements ProgramServicePort {
  constructor(
    private readonly programRepository: ProgramRepositoryImpl,
    private readonly codeHistoryService: CodeHistoryService,
    private readonly userService: UserService,
    private readonly edcService: EdcService
  ) {
    this.programRepository = programRepository
    this.codeHistoryService = codeHistoryService
    this.userService = userService
    this.edcService = edcService
  }

  async getProgram(id: ProgramId): Promise<GetProgramRequest> {
    const program = await this.getById(id)
    return program.toGetProgramRequest()
  }

  async getAllByUser(userId: UserId): Promise<GetProgramsRequest[]> {
    const user: User = await this.userService.getById(userId)
    if (user.role === 'admin') {
      const programs = await this.programRepository.getAll()
      return programs.map((program) => program.toGetProgramsRequest())
    }

    const programs = await this.programRepository.getProgramsByUser(user)
    return programs.map((program) => program.toGetProgramsRequest())
  }

  async search(content: string): Promise<GetProgramsRequest[]> {
    const programsByName = await this.programRepository.getProgramsByName(content)
    const programsByDescription = await this.programRepository.getProgramsByDescription(content)

    const uniqueProgramsMap = new Map<string, Program>()

    programsByName.forEach((program) => uniqueProgramsMap.set(program.programId, program))
    programsByDescription.forEach((program) => uniqueProgramsMap.set(program.programId, program))

    return Array.from(uniqueProgramsMap.values()).map((program) => program.toGetProgramsRequest())
  }

  async createDefault(userId: UserId): Promise<ProgramId> {
    const user: User = await this.userService.getById(userId)

    const defaultPictureName = `https://picsum.photos/536/${Math.floor(Math.random() * 536)}`
    const newProgram = Program.default(defaultPictureName, 'private', user, user)

    return this.programRepository.create(newProgram.toEntity())
  }

  async updateInstructions(id: ProgramId, instructions: ProgramInstructions): Promise<void> {
    const program = await this.getById(id)
    program.instructions = instructions

    await this.programRepository.update(program.toEntity())
  }

  async update(
    id: ProgramId,
    name: string,
    description: string,
    pictureName: string,
    code: string,
    language: string,
    version: string,
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
    program.version = version
    program.programVisibility = visibility
    program.author = editor

    await this.programRepository.update(program.toEntity())
  }

  async delete(id: ProgramId, userId: UserId): Promise<ProgramId> {
    const isAuthor = await this.isProgramAuthor(id, userId)
    const user = await this.userService.getById(userId)
    if (!isAuthor) {
      if (user.role !== 'admin') {
        throw new ProgramException(ProgramMessageException.PERMISSION_DENIED)
      }
    }

    return await this.programRepository.delete(id)
  }

  async isProgramAuthor(programId: ProgramId, userId: UserId): Promise<boolean> {
    const program = await this.programRepository.getById(programId)
    return program.originalAuthor.userId === userId
  }

  async import(id: ProgramId, userId: UserId): Promise<string> {
    const user = await this.userService.getById(userId)
    const program = await this.getById(id)

    const isAuthor = await this.isProgramAuthor(id, userId)
    if (isAuthor) {
      if (user.role !== 'admin') {
        throw new ProgramException(ProgramMessageException.PERMISSION_DENIED)
      }
    }

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
      user,
      program.createdAt
    )

    return this.programRepository.create(programImported.toEntity())
  }

  async execute(programId: ProgramId, userId: UserId): Promise<string> {
    const program = await this.programRepository.getById(programId)

    if (program.programVisibility === 'private' && program.originalAuthor.userId !== userId) {
      throw new ProgramException(ProgramMessageException.PERMISSION_DENIED)
    }

    await this.codeHistoryService.create(program)
    return await this.edcService.executeCode(programId, program.code, program.language, 11)
  }

  private async getById(id: ProgramId): Promise<Program> {
    try {
      return await this.programRepository.getById(id)
    } catch (error) {
      throw new ProgramException(ProgramMessageException.NOT_FOUND)
    }
  }
}
