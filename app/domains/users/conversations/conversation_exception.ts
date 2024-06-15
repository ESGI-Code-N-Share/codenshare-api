export enum ConversationMessageException {
  CONVERSATION_NOT_FOUND = 'Conversation not found',
  CONVERSATION_ALREADY_EXISTS = 'Conversation already exists',
  OWNER_CANNOT_LEAVE_CONVERSATION = 'Owner cannot leave conversation',
  OWNER_ALREADY_IN_CONVERSATION = 'Owner already in conversation',
  USER_ALREADY_IN_CONVERSATION = 'User already in conversation',
  USER_DONT_EXIST_IN_CONVERSATION = 'User dont exist in conversation',
  AT_LEAST_TWO_PARTICIPANTS = 'At least two participants are required',
}

export class ConversationException extends Error {
  constructor(message: ConversationMessageException) {
    super(message)
    this.name = 'ConversationException'
    this.message = message
  }
}
