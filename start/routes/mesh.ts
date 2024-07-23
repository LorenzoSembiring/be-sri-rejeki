import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'MeshesController.store')
    Route.get('index', 'MeshesController.index')
    Route.get('get/:id', 'MeshesController.get')
    Route.get('get-product/:id', 'MeshesController.get3D')
    Route.put('update/:id', 'MeshesController.update')
    Route.delete('delete/:id', 'MeshesController.destroy')

}).prefix('/api/mesh')
