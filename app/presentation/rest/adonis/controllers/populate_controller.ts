import { inject } from '@adonisjs/core'
import { Populate } from '#infrastructure/persistence/populate/index'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PopulateController {
  constructor(private readonly populate: Populate) {}

  async run({ response }: HttpContext) {
    try {
      await this.populate.run()
      return response.status(200).json({ message: 'Populate successful' })
    } catch (e) {
      console.error(e)
      return response.status(400).send({ message: e.message })
    }
  }
}
