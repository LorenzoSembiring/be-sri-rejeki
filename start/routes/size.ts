import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('add', 'SizesController.addSize')
    Route.delete('delete/:id', 'SizesController.deleteSize')

}).prefix('/api/product/size')
