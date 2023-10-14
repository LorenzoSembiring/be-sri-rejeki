import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('register', 'UsersController.register')
    Route.post('login', 'UsersController.login')
    Route.post('logout', 'UsersController.logout')

}).prefix('/api')