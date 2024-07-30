import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'OrdersController.store')
    Route.post('placing-order', 'OrdersController.placingOrder')
    Route.post('check-shipping', 'OrdersController.checkShipping')
    Route.post('add-resi', 'OrdersController.addResi')
    Route.get('get/:id', 'OrdersController.get')
    Route.get('admin-index', 'OrdersController.adminIndex')
    Route.get('waiting-payment', 'OrdersController.getWaitingPayment')
    Route.get('transaction-history', 'OrdersController.getTransactionHistory')
    Route.get('midtrans-status/:id', 'OrdersController.midtransStatus')
    Route.get('get-province', 'OrdersController.getProvince')
    Route.put('update/:id', 'OrdersController.update')
    Route.delete('delete/:id', 'OrdersController.destroy')

}).prefix('/api/order')
