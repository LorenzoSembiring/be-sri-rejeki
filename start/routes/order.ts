import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'OrdersController.store')
    Route.post('placing-order', 'OrdersController.placingOrder')
    Route.post('check-shipping', 'OrdersController.checkShipping')
    Route.get('get/:id', 'OrdersController.get')
    Route.get('midtrans-status/:id', 'OrdersController.midtransStatus')
    Route.get('get-province', 'OrdersController.getProvince')
    Route.put('update/:id', 'OrdersController.update')
    Route.delete('delete/:id', 'OrdersController.destroy')

}).prefix('/api/order')
