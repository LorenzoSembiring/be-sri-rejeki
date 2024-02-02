import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store-category', 'CategoriesController.store')
    Route.get('detail-category/:id', 'CategoriesController.get')
    Route.get('get-category', 'CategoriesController.getAll')
    Route.put('update-category/:id', 'CategoriesController.update')
    Route.delete('delete-category/:id', 'CategoriesController.destroy')

}).prefix('/api')
