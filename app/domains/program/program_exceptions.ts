export enum ProgramMessageException {
  NOT_FOUND = 'Program not found',
  PERMISSION_DENIED = 'Permission denied',
}

export class ProgramException extends Error {
  constructor(message: ProgramMessageException) {
    super(message)
    this.name = 'ProgramException'
    this.message = message
  }
}
