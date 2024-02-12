import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.get('get/:id', 'TexturesController.get')
    Route.put('update/:id', 'TexturesController.update')
    Route.delete('delete/:id', 'TexturesController.destroy')

}).prefix('/api/product/texture')
