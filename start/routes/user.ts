import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('register', 'UsersControllers.register')
    Route.post('login', 'UsersControllers.login')
    Route.post('logout', 'UsersControllers.logout')

}).prefix('/api')