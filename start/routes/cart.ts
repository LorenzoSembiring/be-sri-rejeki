import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'CartsController.insertToCart')
    Route.get('get', 'CartsController.getUserCart')
    Route.put('update/:id', 'CartsController.manageQuantity')
    Route.delete('delete/:id', 'CartsController.deleteCart')

}).prefix('/api/cart')
