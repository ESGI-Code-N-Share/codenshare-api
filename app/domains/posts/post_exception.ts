export enum PostMessageException {
  POST_NOT_FOUND = 'Post not found',
}

export class PostException extends Error {
  constructor(message: PostMessageException) {
    super(message)
    this.name = 'PostException'
    this.message = message
  }
}
