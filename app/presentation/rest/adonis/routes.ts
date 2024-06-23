/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#presentation/rest/adonis/controllers/auth_controller')
const UserController = () => import('#presentation/rest/adonis/controllers/user_controller')
const PostController = () => import('#presentation/rest/adonis/controllers/post_controller')
const FriendController = () => import('#presentation/rest/adonis/controllers/friend_controller')
const MessageController = () => import('#presentation/rest/adonis/controllers/message_controller')
const ProgramController = () =>
  import('#presentation/rest/adonis/controllers/program/program_controller')
const ConversationController = () =>
  import('#presentation/rest/adonis/controllers/conversation_controller')
const PostLikeController = () =>
  import('#presentation/rest/adonis/controllers/post_like_controller')

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

const programRouter = () => {
  router.get('/programs/search', [ProgramController, 'search'])
  router.get('/programs', [ProgramController, 'list'])
  router.get('/programs/:programId', [ProgramController, 'find'])
  router.post('/programs', [ProgramController, 'create']).use([middleware.auth()])
  router
    .delete('/programs/:programId', [ProgramController, 'delete'])
    .use([middleware.auth(), middleware.admin()])
  router.patch('/programs/:programId', [ProgramController, 'update'])
  router.post('/programs/:programId/import', [ProgramController, 'import']).use([middleware.auth()])
  router.post('/programs/:programId/run', [ProgramController, 'run'])
}

const postLikeRouter = () => {
  router
    .group(() => {
      router.post('/likes', [PostLikeController, 'create'])
      router.delete('/likes', [PostLikeController, 'delete'])
    })
    .prefix('/posts/:postId')
}

const postRouter = () => {
  router.get('/posts', [PostController, 'list'])
  router.post('/posts', [PostController, 'create'])
  router.delete('/posts/:postId', [PostController, 'delete'])
  postLikeRouter()
}

const friendRouter = () => {
  router.get('/friends/followers', [FriendController, 'getFollowersByUser'])
  router.get('/friends/following', [FriendController, 'getFollowingByUser'])
  router.post('/friends', [FriendController, 'create'])
  router.delete('/friends', [FriendController, 'delete'])
}

const authRouter = () => {
  router.post('/login', [AuthController, 'login']).use(middleware.guest())
  router.post('/register', [AuthController, 'register']).use(middleware.guest())
  router.post('/logout/', [AuthController, 'logout'])
}

router
  .group(() => {
    authRouter()
    userRouter()
    programRouter()
    postRouter()
    friendRouter()
  })
  .prefix('/api/v1')
