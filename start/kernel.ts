/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to register the middleware with the server
| or the router.
|
*/

import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
server.use([
  () => import('#presentation/rest/adonis/middleware/container_bindings_middleware'),
  () => import('#presentation/rest/adonis/middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
])

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  // () => import('@adonisjs/auth/initialize_auth_middleware'),
  () => import('#presentation/rest/adonis/middleware/initialize_auth_middleware'),
])

/**
 * Named middleware collection must be explicitly assigned to
 * the routes or the routes group.
 */
export const middleware = router.named({
  admin: () => import('#presentation/rest/adonis/middleware/admin_middleware'),
  auth: () => import('#presentation/rest/adonis/middleware/auth_middleware'),
  // author: () => import('#presentation/rest/adonis/middleware/author_middleware'),
})
