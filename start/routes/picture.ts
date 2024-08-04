import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'PicturesController.store')
    Route.get('get/:id', 'PicturesController.index')
    Route.put('update', 'PicturesController.update')
    Route.delete('delete/:id', 'PicturesController.destroy')

}).prefix('/api/product/picture')
