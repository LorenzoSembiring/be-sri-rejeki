import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'OrdersController.store')
    Route.get('get/:id', 'OrdersController.get')
    Route.put('update/:id', 'OrdersController.update')
    Route.delete('delete/:id', 'OrdersController.destroy')

}).prefix('/api/order')
