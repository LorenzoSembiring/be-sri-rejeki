import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store-product', 'ProductsController.store')
    Route.post('get-product', 'ProductsController.get')
    Route.put('update-product/:id', 'ProductsController.update')
    Route.delete('delete-product/:id', 'ProductsController.destroy')

}).prefix('/api')