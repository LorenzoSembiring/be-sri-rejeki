import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'MeshesController.store')
    Route.get('get/:id', 'MeshesController.get')
    Route.put('update/:id', 'MeshesController.update')
    Route.delete('delete/:id', 'MeshesController.destroy')

}).prefix('/api/mesh')
