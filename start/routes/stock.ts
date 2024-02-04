import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.put('update-stock/:id', 'StocksController.update')

}).prefix('/api')
