import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'CategoriesController.store')
    Route.get('detail/:id', 'CategoriesController.get')
    Route.get('get', 'CategoriesController.getAll')
    Route.put('update/:id', 'CategoriesController.update')
    Route.delete('delete/:id', 'CategoriesController.destroy')

}).prefix('/api/category')
