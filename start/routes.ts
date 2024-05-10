/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const ProgramsController = () => import('#controllers/programs_controller')

router
  .group(() => {
    router.get('/ping', async () => 'pong')
    // router.get('/users', [UsersController, 'index'])

    /* Programs */
    router
      .group(() => {
        router.get('/', [ProgramsController, 'list'])
        router.get('/:programId', [ProgramsController, 'find'])
        router.post('/', [ProgramsController, 'create'])
        router.post('/:programId/run', [ProgramsController, 'run'])
        router.put('/:programId', [ProgramsController, 'update'])
        router.delete('/:programId', [ProgramsController, 'delete'])
      })
      .prefix('/programs')
  })
  .prefix('/api/v1')
