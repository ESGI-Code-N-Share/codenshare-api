import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ProgramService } from '#domains/program/program_service'
import {
  createProgramValidator,
  programsValidator,
  searchProgramsValidator,
  updateProgramsValidator,
} from '#presentation/rest/adonis/controllers/program/program_validator'
import { ProgramVisibility } from '#domains/program/program_model'

@inject()
export default class ProgramController {
  constructor(private readonly programService: ProgramService) {
    //todo: inject ProgramServicePort
    this.programService = programService
  }

  async list({ request, response }: HttpContext) {
    try {
      const validQuery = await programsValidator.validate(request.qs())
      const programs = await this.programService.getAllByUser(validQuery.userId)
      return response.status(200).json({ data: programs })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async find({ response, params }: HttpContext) {
    try {
      const program = await this.programService.getProgram(params.programId)
      return response.status(200).json({ data: program })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async search({ request, response }: HttpContext) {
    try {
      const validQuery = await searchProgramsValidator.validate(request.qs())
      const programs = await this.programService.search(validQuery.query)
      return response.status(200).json(programs)
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async create({ response, request }: HttpContext) {
    try {
      const data = request.all()
      const validProgram = await createProgramValidator.validate(data)
      const programId = await this.programService.createDefault(validProgram.authorId)
      return response.status(201).send({ data: programId })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async delete({ request, response, params }: HttpContext) {
    try {
      const data = request.all()
      const validProgram = await programsValidator.validate(data)

      const programId = await this.programService.delete(params.programId, validProgram.userId)
      return response.status(200).send({ data: programId })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async import({ request, response, params }: HttpContext) {
    try {
      const data = request.all()
      const validProgram = await programsValidator.validate(data)

      await this.programService.import(params.programId, validProgram.userId)
      return response.status(200)
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }

  async update({ request, response, params }: HttpContext) {
    try {
      const data = request.all()
      const validProgram = await updateProgramsValidator.validate(data)
      await this.programService.update(
        params.programId,
        validProgram.name,
        validProgram.description,
        validProgram.pictureURL,
        validProgram.code || '',
        validProgram.language,
        validProgram.visibility as ProgramVisibility,
        validProgram.authorId
      )
      return response.status(200).send({ data: params.programId })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }
}
