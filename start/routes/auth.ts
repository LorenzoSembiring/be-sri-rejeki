import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('authenticated-user', 'AuthController.userByAuth')
  Route.get('token-validation', 'AuthController.check')
}).prefix('/api/auth')
