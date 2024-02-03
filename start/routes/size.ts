import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('add-size', 'SizesController.addSize')
    Route.delete('delete-size/:id', 'SizesController.deleteSize')

}).prefix('/api')
