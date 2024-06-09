export enum PostLikeMessageException {
  ALREADY_LIKED = 'Post already liked',
  NOT_LIKED = 'Post not liked',
}

export class PostLikeException extends Error {
  constructor(message: PostLikeMessageException) {
    super(message)
    this.name = 'PostLikeException'
    this.message = message
  }
}
