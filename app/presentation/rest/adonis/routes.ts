/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// const AuthController = () => import('#presentation/rest/adonis/controllers/auth_controller')
const UserController = () => import('#presentation/rest/adonis/controllers/user_controller')
const PostController = () => import('#presentation/rest/adonis/controllers/post_controller')
const FriendController = () => import('#presentation/rest/adonis/controllers/friend_controller')
const MessageController = () => import('#presentation/rest/adonis/controllers/message_controller')
const ConversationController = () =>
  import('#presentation/rest/adonis/controllers/conversation_controller')

const authRouter = () => {
  // router.post('/auth/login', [AuthController, ''])
}

const messageRouter = () => {
  router
    .group(() => {
      router.get('/messages', [MessageController, 'getByConversation'])
      router.post('/messages', [MessageController, 'send'])
    })
    .prefix('users/:userId/conversations/:conversationId')
}

const conversationRouter = () => {
  router
    .group(() => {
      router.get('/conversations', [ConversationController, 'getByUser'])
      router.post('/conversations', [ConversationController, 'create'])
      router.delete('/conversations/:conversationId', [ConversationController, 'delete'])
    })
    .prefix('/users/:userId')
  messageRouter()
}

const userRouter = () => {
  router.get('/users/search', [UserController, 'search'])
  router.get('/users/:userId', [UserController, 'find'])
  router.delete('/users/:userId', [UserController, 'delete'])
  conversationRouter()
}

const postRouter = () => {
  router.get('/posts', [PostController, 'list'])
  router.post('/posts', [PostController, 'create'])
  router.delete('/posts/:postId', [PostController, 'delete'])
}

const friendRouter = () => {
  router.post('/friends', [FriendController, 'create'])
  router.delete('/friends', [FriendController, 'delete'])
}

router
  .group(() => {
    authRouter()
    userRouter()
    postRouter()
    friendRouter()
  })
  .prefix('/api/v1')
