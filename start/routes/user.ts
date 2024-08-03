import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('register', 'UsersController.register')
    Route.post('login', 'UsersController.login')
    Route.get('logout', 'UsersController.logout')
    Route.put('update-picture', 'UsersController.updatePicture')

}).prefix('/api/user')
