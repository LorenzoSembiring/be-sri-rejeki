import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'ProductsController.store')
    Route.get('get-by-category', 'ProductsController.getByCategory')
    Route.get('index', 'ProductsController.getAll')
    Route.get('get/:id', 'ProductsController.get')
    Route.get('activate/:id', 'ProductsController.activate')
    Route.get('deactivate/:id', 'ProductsController.deactivate')
    Route.put('update/:id', 'ProductsController.update')
    Route.delete('delete/:id', 'ProductsController.destroy')

}).prefix('/api/product')
