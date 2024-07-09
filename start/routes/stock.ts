import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('/:id', 'StocksController.getByProduct')
  Route.put('update/:id', 'StocksController.update')

}).prefix('/api/product/stock')
