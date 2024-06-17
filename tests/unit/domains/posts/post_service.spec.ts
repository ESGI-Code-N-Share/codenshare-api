import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { PostRepositoryImpl } from '#infrastructure/orm/lucid/repositories/post_repository_impl'
import { UserService } from '#domains/users/user_service'
import { UserRepositoryImpl } from '#infrastructure/orm/lucid/repositories/user_repository_impl'
import { PostSample } from '#tests/unit/domains/utils/post_sample'
import { UserSample } from '#tests/unit/domains/utils/user_sample'
import { PostService } from '#domains/posts/post_service'
import { PostException, PostMessageException } from '#domains/posts/post_exception'
import { CreatePostDto } from '#domains/posts/post_dto'
import Post from '#domains/posts/post_model'
import { UserException, UserMessageException } from '#domains/users/user_exception'

test.group('PostService - GetAll', (group) => {
  let postService: PostService
  let postRepository: PostRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    postRepository = new PostRepositoryImpl()
    userService = new UserService(userRepository)
    postService = new PostService(postRepository, userService)
  })

  test('should get all posts', async ({ assert }) => {
    const authors = [UserSample.new({ userId: '1' }), UserSample.new({ userId: '2' })]
    const posts = [
      PostSample.new({ postId: '1', author: authors[0] }),
      PostSample.new({ postId: '2', author: authors[1] }),
    ]

    const getAllStub = sinon.stub(postRepository, 'getAll').resolves(posts)

    const result = await postService.getAll()

    assert.exists(result)
    assert.lengthOf(result, 2)

    getAllStub.restore()
  })

  test('should get an empty array if no posts', async ({ assert }) => {
    const getAllStub = sinon.stub(postRepository, 'getAll').resolves([])

    const posts = await postService.getAll()

    assert.lengthOf(posts, 0)
    assert.isTrue(getAllStub.calledOnce)

    getAllStub.restore()
  })
})

test.group('PostService - GetById', (group) => {
  let postService: PostService
  let postRepository: PostRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    postRepository = new PostRepositoryImpl()
    userService = new UserService(userRepository)
    postService = new PostService(postRepository, userService)
  })

  test('should get a post by id if post exist', async ({ assert }) => {
    const postId = '1'
    const getByIdStub = sinon
      .stub(postRepository, 'getById')
      .resolves(PostSample.new({ postId: postId }))

    const post = await postService.getById(postId)

    assert.exists(post)
    assert.equal(post.postId, postId)
    assert.isTrue(getByIdStub.calledOnce)

    getByIdStub.restore()
  })

  test('should throw PostException if post not exist', async ({ assert }) => {
    const postId = 'NOT_FOUND'
    const getByIdStub = sinon
      .stub(postRepository, 'getById')
      .rejects(new PostException(PostMessageException.POST_NOT_FOUND))

    try {
      await postService.getById(postId)
      assert.fail('Should throw an exception')
    } catch (e) {
      assert.equal(e.message, PostMessageException.POST_NOT_FOUND)
    }

    getByIdStub.restore()
  })
})

test.group('PostService - GetByUser', (group) => {
  let postService: PostService
  let postRepository: PostRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    postRepository = new PostRepositoryImpl()
    userService = new UserService(userRepository)
    postService = new PostService(postRepository, userService)
  })

  test('should get all posts by user', async ({ assert }) => {
    const userId = '1'
    const user = UserSample.new({ userId: userId })
    const posts = [
      PostSample.new({ postId: '1', author: user }),
      PostSample.new({ postId: '2', author: user }),
    ]

    const getByUserStub = sinon.stub(postRepository, 'getByUser').resolves(posts)

    const result = await postService.getByUser(userId)

    assert.exists(result)
    assert.lengthOf(result, 2)

    getByUserStub.restore()
  })

  test('should get an empty array if no posts by user', async ({ assert }) => {
    const userId = '1'
    const getByUserStub = sinon.stub(postRepository, 'getByUser').resolves([])

    const posts = await postService.getByUser(userId)

    assert.lengthOf(posts, 0)
    assert.isTrue(getByUserStub.calledOnce)

    getByUserStub.restore()
  })
})

test.group('PostService - GetAll', (group) => {
  let postService: PostService
  let postRepository: PostRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    postRepository = new PostRepositoryImpl()
    userService = new UserService(userRepository)
    postService = new PostService(postRepository, userService)
  })

  test('should create a post', async ({ assert }) => {
    const userId = '1'
    const user = UserSample.new({ userId: userId })
    const createPostDto: CreatePostDto = {
      authorId: userId,
      title: 'title',
      content: 'content',
      image: undefined,
    }

    const userStub = sinon.stub(userService, 'getById').resolves(user)
    const createStub = sinon
      .stub(postRepository, 'create')
      .resolves(Post.new(createPostDto.title, createPostDto.content, user, createPostDto.image))

    const post = await postService.create(createPostDto)

    assert.exists(post)
    assert.exists(post.postId)
    assert.equal(post.author.userId, userId)
    assert.equal(post.title, createPostDto.title)
    assert.equal(post.content, createPostDto.content)
    assert.exists(post.postedAt)
    assert.isTrue(userStub.calledOnce)
    assert.isTrue(createStub.calledOnce)

    userStub.restore()
    createStub.restore()
  })

  test('should throw UserException if no user found', async ({ assert }) => {
    const userId = '1'
    const createPostDto: CreatePostDto = {
      authorId: userId,
      title: 'title',
      content: 'content',
      image: undefined,
    }

    const userStub = sinon
      .stub(userService, 'getById')
      .rejects(new UserException(UserMessageException.USER_NOT_FOUND))

    try {
      await postService.create(createPostDto)
      assert.fail('Should throw an exception')
    } catch (e) {
      assert.equal(e.message, UserMessageException.USER_NOT_FOUND)
    }

    userStub.restore()
  })

  test('should throw PostException if dto is invalid', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const createPostDto: CreatePostDto = {
      title: '',
      content: '',
      image: '',
      authorId: user.userId,
    }

    const userStub = sinon.stub(userService, 'getById').resolves(user)
    const createStub = sinon
      .stub(postRepository, 'create')
      .resolves(assert.fail('Should not be called'))

    try {
      await postService.create(createPostDto)
      assert.fail('Should throw an exception')
    } catch (e) {
      assert.equal(e.message, PostMessageException.INVALID_PAYLOAD)
    }

    userStub.restore()
    createStub.restore()
  })
})

test.group('PostService - Delete', (group) => {
  let postService: PostService
  let postRepository: PostRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl

  group.each.setup(() => {
    postRepository = new PostRepositoryImpl()
    userService = new UserService(userRepository)
    postService = new PostService(postRepository, userService)
  })

  test('should delete a post', async ({ assert }) => {
    const postId = '1'
    const post = PostSample.new({ postId: postId })
    const getByIdStub = sinon.stub(postService, 'getById').resolves(post)
    const deleteStub = sinon.stub(postRepository, 'delete').resolves(postId)

    const result = await postService.delete(postId)

    assert.equal(result, postId)
    assert.isTrue(getByIdStub.calledOnce)
    assert.isTrue(deleteStub.calledOnce)

    getByIdStub.restore()
    deleteStub.restore()
  })

  test('should throw PostException if post not found', async ({ assert }) => {
    const postId = 'NOT_FOUND'
    const getByIdStub = sinon.stub(postRepository, 'getById').rejects(new Error())

    try {
      await postService.delete(postId)
      assert.fail('Should throw an exception')
    } catch (e) {
      assert.equal(e.message, PostMessageException.POST_NOT_FOUND)
    }

    getByIdStub.restore()
  })
})
