import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.get('get/:id', 'TexturesController.get')
    Route.put('update/:id', 'TexturesController.update')

}).prefix('/api/product/texture')
