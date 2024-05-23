import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ProgramService } from '#services/program_service'

@inject()
export default class ProgramsController {
  constructor(private readonly programsService: ProgramService) {
    this.programsService = programsService
  }

  async create({ response }: HttpContext) {
    const programId = await this.programsService.create()
    return response.json({ programId })
  }

  async list({ response }: HttpContext) {
    const programs = await this.programsService.list()
    return response.json({ data: programs })
  }

  async find({ response, params }: HttpContext) {
    const program = await this.programsService.find(params.programId)
    return response.json({ program })
  }

  async update({ response, params, request }: HttpContext) {
    const programId = params.programId
    const body = request.all()
    const fields = {
      language: body.language || null,
      name: body.name || null,
      description: body.description || null,
      visibility: body.visibility || 'private',
      code: body.code || null,
      pictureName: body.pictureName || null,
    }

    const program = await this.programsService.update(programId, fields)
    return response.json({ program })
  }

  async delete({ response, params }: HttpContext) {
    const programId = params.programId
    const program = await this.programsService.delete(programId)
    return response.json({ program })
  }

  async run({ response, params, request }: HttpContext) {
    const programId = params.programId
    const body = request.all()
    const code = body.code
    const language = body.language
    const version = body.version

    try {
      const result = await this.programsService.run(programId, code, language, version)
      return response.json(result)
    } catch (error) {
      console.error(`Failed to run program ${programId}: ${error.message}`)
      return response.status(500).json({
        message: 'Failed to execute the program',
        error: error.message,
      })
    }
  }
}
