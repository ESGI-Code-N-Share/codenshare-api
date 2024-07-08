import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { PostLikeService } from '#domains/posts/post_like/post_like_service'
import { PostLikeRepositoryImpl } from '#infrastructure/orm/lucid/repositories/post_like_repository_impl'
import { PostService } from '#domains/posts/post_service'
import { PostRepositoryImpl } from '#infrastructure/orm/lucid/repositories/post_repository_impl'
import { UserService } from '#domains/users/user_service'
import { UserRepositoryImpl } from '#infrastructure/orm/lucid/repositories/user_repository_impl'
import { CreatePostLikeDto, DeletePostLikeDto } from '#domains/posts/post_like/post_like_dto'
import { PostSample } from '#tests/unit/domains/utils/post_sample'
import { UserSample } from '#tests/unit/domains/utils/user_sample'
import { PostLikeMessageException } from '#domains/posts/post_like/post_like_exception'
import { UserException, UserMessageException } from '#domains/users/user_exception'
import { PostException, PostMessageException } from '#domains/posts/post_exception'
import { ProgramService } from '#domains/program/program_service'

test.group('PostLikeService - LikePost', (group) => {
  let postLikeService: PostLikeService
  let postLikeRepository: PostLikeRepositoryImpl
  let postService: PostService
  let postRepository: PostRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl
  let programService: ProgramService

  group.each.setup(() => {
    postLikeRepository = new PostLikeRepositoryImpl()
    postRepository = new PostRepositoryImpl()
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
    postService = new PostService(postRepository, userService, programService)
    postLikeService = new PostLikeService(postLikeRepository, postService, userService)
  })

  test('should like a post if not already like by a user', async ({ assert }) => {
    const postLikeId = '1'
    const user = UserSample.new({ userId: '1' })
    const post = PostSample.new({ postId: '1', author: user })
    const createPostLikeDto: CreatePostLikeDto = {
      userId: user.userId,
      postId: post.postId,
    }
    const getPostByIdStub = sinon.stub(postService, 'getById').resolves(post)
    const getUserByIdStub = sinon.stub(userService, 'getById').resolves(user)
    const createPostLikeStub = sinon.stub(postLikeRepository, 'create').resolves(postLikeId)
    const isLikedStub = sinon.stub(postLikeRepository, 'isPostLiked').resolves(false)

    const result = await postLikeService.likePost(createPostLikeDto)

    assert.exists(result)
    assert.isTrue(getPostByIdStub.calledOnce)
    assert.isTrue(getUserByIdStub.calledOnce)
    assert.isTrue(createPostLikeStub.calledOnce)
    assert.isTrue(isLikedStub.calledOnce)

    getPostByIdStub.restore()
    getUserByIdStub.restore()
    createPostLikeStub.restore()
    isLikedStub.restore()
  })

  test('should throw PostLikeException if user already like', async ({ assert }) => {
    const user = UserSample.new({ userId: '1' })
    const post = PostSample.new({ postId: '1', author: user })
    const createPostLikeDto: CreatePostLikeDto = {
      userId: user.userId,
      postId: post.postId,
    }
    const getPostByIdStub = sinon.stub(postService, 'getById').resolves(post)
    const getUserByIdStub = sinon.stub(userService, 'getById').resolves(user)
    const isLikedStub = sinon.stub(postLikeRepository, 'isPostLiked').resolves(true)

    try {
      await postLikeService.likePost(createPostLikeDto)
      assert.fail('Should throw PostLikeException')
    } catch (e) {
      assert.equal(e.message, PostLikeMessageException.ALREADY_LIKED)
    }

    assert.isTrue(getPostByIdStub.calledOnce)
    assert.isTrue(getUserByIdStub.calledOnce)
    assert.isTrue(isLikedStub.calledOnce)

    getPostByIdStub.restore()
    getUserByIdStub.restore()
    isLikedStub.restore()
  })

  test('should throw an error if post not found', async ({ assert }) => {
    const userId = '1'
    const postId = '1'
    const createPostLikeDto: CreatePostLikeDto = {
      userId: userId,
      postId: postId,
    }

    const getPostByIdStub = sinon
      .stub(postService, 'getById')
      .rejects(new PostException(PostMessageException.POST_NOT_FOUND))

    try {
      await postLikeService.likePost(createPostLikeDto)
      assert.fail('Should throw UserException')
    } catch (e) {
      assert.equal(e.message, PostMessageException.POST_NOT_FOUND)
      assert.isTrue(getPostByIdStub.calledOnce)
    }

    getPostByIdStub.restore()
  })

  test('should throw an error if user not found', async ({ assert }) => {
    const userId = '1'
    const postId = '1'
    const createPostLikeDto: CreatePostLikeDto = {
      userId: userId,
      postId: postId,
    }

    const getPostByIdStub = sinon.stub(postService, 'getById').resolves(PostSample.new({ postId }))
    const getUserByIdStub = sinon
      .stub(userService, 'getById')
      .rejects(new UserException(UserMessageException.USER_NOT_FOUND))

    try {
      await postLikeService.likePost(createPostLikeDto)
      assert.fail('Should throw UserException')
    } catch (e) {
      assert.equal(e.message, UserMessageException.USER_NOT_FOUND)
      assert.isTrue(getPostByIdStub.calledOnce)
      assert.isTrue(getUserByIdStub.calledOnce)
    }

    getPostByIdStub.restore()
    getUserByIdStub.restore()
  })
})

test.group('PostLikeService - UnlikePost', (group) => {
  let postLikeService: PostLikeService
  let postLikeRepository: PostLikeRepositoryImpl
  let postService: PostService
  let postRepository: PostRepositoryImpl
  let userService: UserService
  let userRepository: UserRepositoryImpl
  let programService: ProgramService

  group.each.setup(() => {
    postLikeRepository = new PostLikeRepositoryImpl()
    postRepository = new PostRepositoryImpl()
    userRepository = new UserRepositoryImpl()
    userService = new UserService(userRepository)
    postService = new PostService(postRepository, userService, programService)
    postLikeService = new PostLikeService(postLikeRepository, postService, userService)
  })

  test('should unlike a post if already like by a user', async ({ assert }) => {
    const postLikeId = '1'
    const user = UserSample.new({ userId: '1' })
    const post = PostSample.new({ postId: '1', author: user })
    const deletePostLikeDto: DeletePostLikeDto = {
      userId: user.userId,
      postId: post.postId,
    }

    const getPostByIdStub = sinon.stub(postService, 'getById').resolves(post)
    const getUserByIdStub = sinon.stub(userService, 'getById').resolves(user)
    const deletePostLikeStub = sinon.stub(postLikeRepository, 'delete').resolves(postLikeId)
    const getPostLikeStub = sinon.stub(postLikeRepository, 'getByPostAndUser').resolves({
      postLikeId,
      postId: post.postId,
      userId: user.userId,
      likedAt: new Date(),
    })

    const result = await postLikeService.unlikePost(deletePostLikeDto)

    assert.exists(result)
    assert.isTrue(getPostByIdStub.calledOnce)
    assert.isTrue(getUserByIdStub.calledOnce)
    assert.isTrue(deletePostLikeStub.calledOnce)
    assert.isTrue(getPostLikeStub.calledOnce)

    getPostByIdStub.restore()
    getUserByIdStub.restore()
    deletePostLikeStub.restore()
    getPostLikeStub.restore()
  })

  test('should throw PostLikeException if user not already like', async ({ assert }) => {
    const postLikeId = '1'
    const user = UserSample.new({ userId: '1' })
    const post = PostSample.new({ postId: '1', author: user })
    const createPostLikeDto: CreatePostLikeDto = {
      userId: user.userId,
      postId: post.postId,
    }

    const getPostByIdStub = sinon.stub(postService, 'getById').resolves(post)
    const getUserByIdStub = sinon.stub(userService, 'getById').resolves(user)
    const createPostLikeStub = sinon.stub(postLikeRepository, 'delete').resolves(postLikeId)
    const getPostLikeStub = sinon.stub(postLikeRepository, 'getByPostAndUser').rejects(new Error())

    try {
      await postLikeService.unlikePost(createPostLikeDto)
      assert.fail('Should throw PostLikeException')
    } catch (e) {
      assert.equal(e.message, PostLikeMessageException.NOT_LIKED)
      assert.isTrue(getPostByIdStub.calledOnce)
      assert.isTrue(getUserByIdStub.calledOnce)
      assert.isTrue(getPostLikeStub.calledOnce)
    }

    getPostByIdStub.restore()
    getUserByIdStub.restore()
    createPostLikeStub.restore()
    getPostLikeStub.restore()
  })

  test('should throw an error if post not found', async ({ assert }) => {
    const userId = '1'
    const postId = '1'
    const createPostLikeDto: CreatePostLikeDto = {
      userId: userId,
      postId: postId,
    }

    const getPostByIdStub = sinon
      .stub(postService, 'getById')
      .rejects(new PostException(PostMessageException.POST_NOT_FOUND))

    try {
      await postLikeService.unlikePost(createPostLikeDto)
      assert.fail('Should throw UserException')
    } catch (e) {
      assert.equal(e.message, PostMessageException.POST_NOT_FOUND)
      assert.isTrue(getPostByIdStub.calledOnce)
    }

    getPostByIdStub.restore()
  })

  test('should throw an error if user not found', async ({ assert }) => {
    const userId = '1'
    const postId = '1'
    const createPostLikeDto: CreatePostLikeDto = {
      userId: userId,
      postId: postId,
    }

    const getPostByIdStub = sinon.stub(postService, 'getById').resolves(PostSample.new({ postId }))
    const getUserByIdStub = sinon
      .stub(userService, 'getById')
      .rejects(new UserException(UserMessageException.USER_NOT_FOUND))

    try {
      await postLikeService.unlikePost(createPostLikeDto)
      assert.fail('Should throw UserException')
    } catch (e) {
      assert.equal(e.message, UserMessageException.USER_NOT_FOUND)
      assert.isTrue(getPostByIdStub.calledOnce)
      assert.isTrue(getUserByIdStub.calledOnce)
    }

    getPostByIdStub.restore()
    getUserByIdStub.restore()
  })
})
