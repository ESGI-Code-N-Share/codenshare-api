import Program, {ProgramId} from '#models/program'
import {inject} from '@adonisjs/core'
import {randomUUID} from 'node:crypto'
import User from '#models/user'

@inject()
export class ProgramService {
  constructor() {}

  async create(): Promise<ProgramId> {
    const programId = randomUUID() as ProgramId
    const user = await User.findOrFail('11111111-1111-1111-1111-111111111111') // todo change
    await user.related('programs').create({
      programId,
    })
    return programId
  }

  async list(): Promise<Program[]> {
    const user = await User.findOrFail('11111111-1111-1111-1111-111111111111') // todo change
    return user.related('programs').query().select('*')
  }

  async find(programId: ProgramId): Promise<Program> {
    const user = await User.findOrFail('11111111-1111-1111-1111-111111111111') // todo change
    return user.related('programs').query().where('programId', programId).firstOrFail()
  }

  async update(
    programId: ProgramId,
    body: {
      language: string
      name: string
      description: string
      visibility: 'public' | 'private' | 'protected'
      code: string
      pictureName: string
    }
  ): Promise<Program> {
    const user = await User.findOrFail('11111111-1111-1111-1111-111111111111') // todo change
    const program = await user
      .related('programs')
      .query()
      .where('programId', programId)
      .firstOrFail()
    program.merge(body)
    await program.save()
    return program
  }

  async delete(programId: ProgramId): Promise<Program> {
    const user = await User.findOrFail('11111111-1111-1111-1111-111111111111') // todo change
    const program = await user
      .related('programs')
      .query()
      .where('programId', programId)
      .firstOrFail()
    await program.delete()
    return program
  }

  async run(programId: ProgramId, _instructions: {}, _files: any, mode: 'debug' | 'run' = 'run') {
    const program = await this.find(programId)
    console.log(`Running program ${program.programId} in ${mode} mode`)

    // todo run the program
  }
}
