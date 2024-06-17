import { test } from '@japa/runner'
import * as sinon from 'sinon'
import ConversationEntity from '#infrastructure/orm/lucid/entities/conversation_entity'
import { ConversationRepositoryImpl } from '#infrastructure/orm/lucid/repositories/conversation_repository_impl'

test.group('ConversationRepositoryImpl - GetByUser', (group) => {
  group.teardown(async () => {
    sinon.restore()
  })

  test('should return conversations for a specific user', async ({
    /*assert*/
  }) => {
    // const user = UserSample.new({ userId: '1' })
    // const conversation = ConversationSample.new({ conversationId: '1', owner: user })
    //
    // const queryStub = {
    //   where: sinon.stub().returnsThis(),
    //   preload: sinon.stub().returnsThis(),
    //   map: sinon.stub().returns([conversation]),
    // }
    //
    // // @ts-ignore
    // const lucidStub = sinon.stub(ConversationEntity, 'query').returns(queryStub)
    //
    // const conversationRepository = new ConversationRepositoryImpl()
    // const result = await conversationRepository.getByUser(user.userId)
    //
    // assert.deepEqual(result, [conversation])
    //
    // lucidStub.restore()
  })

  test('should return a specific conversation', async ({
    /*assert*/
  }) => {
    // const conversationId = '1'
    // const conversation = ConversationSample.new({ conversationId })
    //
    // const queryStub = {
    //   where: sinon.stub().returnsThis(),
    //   preload: sinon.stub().returnsThis(),
    //   firstOrFail: sinon.stub().resolves(new ConversationEntity()),
    // }
    //
    // // @ts-ignore
    // const lucidStub = sinon.stub(ConversationEntity, 'query').returns(queryStub)
    //
    // const conversationRepository = new ConversationRepositoryImpl()
    // const result = await conversationRepository.getById(conversationId)
    //
    // assert.deepEqual(result, conversation)
    //
    // lucidStub.restore()
  })

  test('should create a new conversation', async ({
    /*assert*/
  }) => {
    // const user = UserSample.new({ userId: '1' })
    // const conversation = ConversationSample.new({ conversationId: '1', owner: user })
    //
    // const createStub = sinon.stub(ConversationEntity, 'create').resolves(new ConversationEntity())
    // const attachStub = sinon.stub(ConversationEntity.prototype, 'attach').resolves()
    // const queryStub = {
    //   where: sinon.stub().returnsThis(),
    //   preload: sinon.stub().returnsThis(),
    //   firstOrFail: sinon.stub().resolves(new ConversationEntity()),
    // }
    //
    // // @ts-ignore
    // const lucidStub = sinon.stub(ConversationEntity, 'query').returns(queryStub)
    //
    // const conversationRepository = new ConversationRepositoryImpl()
    // const result = await conversationRepository.create(conversation)
    //
    // assert.deepEqual(result, conversation)
    //
    // createStub.restore()
    // lucidStub.restore()
    // attachStub.restore()
  })

  test('should delete a conversation', async ({ assert }) => {
    const conversationId = '1'
    const conversationEntity = new ConversationEntity()

    const saveStub = sinon.stub(conversationEntity, 'save').resolves()
    const findOrFailStub = sinon.stub(ConversationEntity, 'findOrFail').resolves(conversationEntity)

    const conversationRepository = new ConversationRepositoryImpl()
    await conversationRepository.delete(conversationId)

    assert.isTrue(saveStub.calledOnce)

    findOrFailStub.restore()
    saveStub.restore()
  })

  // test('should remove a user from a conversation', async ({ assert }) => {
  //   const conversationId = '1'
  //   const userId = '1'
  //   const conversationEntity = new ConversationEntity()
  //
  //   const findOrFailStub = sinon.stub(ConversationEntity, 'findOrFail').resolves(conversationEntity)
  //
  //   const conversationRepository = new ConversationRepositoryImpl()
  //   await conversationRepository.removeUser(conversationId, userId)
  //
  //
  //   findOrFailStub.restore()
  // })
})
