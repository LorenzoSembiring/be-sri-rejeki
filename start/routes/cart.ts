import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.post('store', 'CartsController.insertToCart')
    Route.get('get', 'CartsController.getUserCart')
    Route.get('get/:id', 'CartsController.get')
    Route.get('get-product-id/:id', 'CartsController.getProductID')
    Route.get('total-price', 'CartsController.totalPrice')
    Route.put('update/:id', 'CartsController.manageQuantity')
    Route.delete('delete/:id', 'CartsController.deleteCart')

}).prefix('/api/cart')
