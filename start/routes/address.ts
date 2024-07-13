import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'AddressesController.store')
    Route.get('get/:id', 'AddressesController.get')
    Route.put('update/:id', 'AddressesController.update')
    Route.put('update-selected/:id', 'AddressesController.selectAddress')
    Route.delete('delete/:id', 'AddressesController.destroy')

}).prefix('/api/address')
