import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store-address', 'AddressesController.store')
    Route.get('get-address/:id', 'AddressesController.get')
    Route.put('update-address/:id', 'AddressesController.update')
    Route.delete('delete-address/:id', 'AddressesController.destroy')

}).prefix('/api')