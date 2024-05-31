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

const userRouter = () => {
  router.get('/users/search', [UserController, 'search'])
  router.get('/users/:userId', [UserController, 'find'])
  router.delete('/users/:userId', [UserController, 'delete'])
}

router
  .group(() => {
    userRouter()
  })
  .prefix('/api/v1')
