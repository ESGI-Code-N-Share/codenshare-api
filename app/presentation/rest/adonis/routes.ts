/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UserController = () => import('#presentation/rest/adonis/controllers/user_controller')
const PostController = () => import('#presentation/rest/adonis/controllers/post_controller')
const FriendController = () => import('#presentation/rest/adonis/controllers/friend_controller')
const ProgramController = () =>
  import('#presentation/rest/adonis/controllers/program/program_controller')

const userRouter = () => {
  router.get('/users/search', [UserController, 'search'])
  router.get('/users/:userId', [UserController, 'find'])
  router.delete('/users/:userId', [UserController, 'delete'])
}

const programRouter = () => {
  router.get('/programs/search', [ProgramController, 'search'])
  router.get('/programs', [ProgramController, 'list'])
  router.get('/programs/:programId', [ProgramController, 'find'])
  router.post('/programs', [ProgramController, 'create'])
  router.delete('/programs/:programId', [ProgramController, 'delete'])
  router.patch('/programs/:programId', [ProgramController, 'update'])
  router.post('/programs/:programId/import', [ProgramController, 'import'])
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
    userRouter()
    programRouter()
    postRouter()
    friendRouter()
  })
  .prefix('/api/v1')
