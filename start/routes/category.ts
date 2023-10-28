import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store-category', 'AddressesController.store')
    Route.post('get-category', 'AddressesController.get')
    Route.put('update-category/:id', 'AddressesController.update')
    Route.delete('delete-category/:id', 'AddressesController.destroy')

}).prefix('/api')