import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.put('update/:id', 'StocksController.update')

}).prefix('/api/product/stock')
