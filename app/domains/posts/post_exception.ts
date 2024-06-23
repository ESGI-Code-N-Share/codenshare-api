export enum PostMessageException {
  POST_NOT_FOUND = 'Post not found',
  INVALID_PAYLOAD = 'Post payload invalid',
}

export class PostException extends Error {
  constructor(message: PostMessageException) {
    super(message)
    this.name = 'PostException'
    this.message = message
  }
}
