import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('cost', 'RajaOngkirsController.getCost')
}).prefix('/api/rajaongkir')
