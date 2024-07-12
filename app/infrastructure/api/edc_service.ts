import env from '#start/env'
import axios, { AxiosInstance } from 'axios'

export class EdcService {
  private httpClient: AxiosInstance

  constructor() {
    this.httpClient = axios.create({
      baseURL: env.get('EDC_URL'),
    })
  }

  async executeCode(
    programId: string,
    code: string,
    language: string,
    version: string
  ): Promise<string> {
    try {
      const response = await this.httpClient.post('/execute-code', {
        uuid: programId,
        code: code,
        language: language,
        version: version,
      })
      return response.data.taskId
    } catch (error) {
      console.error('Error executing code:', error)
      throw new Error('Failed to execute code')
    }
  }
}
