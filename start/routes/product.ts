import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store-product', 'ProductsController.store')
    Route.get('get-product-by-category', 'ProductsController.getByCategory')
    Route.get('get-product', 'ProductsController.getAll')
    Route.get('activate-product/:id', 'ProductsController.activate')
    Route.get('deactivate-product/:id', 'ProductsController.deactivate')
    Route.put('update-product/:id', 'ProductsController.update')
    Route.delete('delete-product/:id', 'ProductsController.destroy')

}).prefix('/api')
