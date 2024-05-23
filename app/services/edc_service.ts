import axios, { AxiosInstance } from 'axios'

export class EDCService {
  private httpClient: AxiosInstance

  constructor() {
    this.httpClient = axios.create({
      baseURL: 'http://localhost:5000',
    })
  }

  async executeCode(
    programId: string,
    code: string | null,
    language: string | null,
    version: string | null
  ) {
    try {
      const response = await this.httpClient.post('/execute-code', {
        uuid: programId,
        code: code,
        language: language,
        version: version,
      })
      return response.data
    } catch (error) {
      console.error('Error executing code:', error)
      throw new Error('Failed to execute code')
    }
  }
}
