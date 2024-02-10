import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'PicturesController.store')
    Route.get('get/:id', 'PicturesController.index')
    Route.put('update/:id', 'PicturesController.update')
    Route.delete('delete', 'PicturesController.destroy')

}).prefix('/api/product/picture')
