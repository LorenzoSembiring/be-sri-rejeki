import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    Route.get('new-order', 'DashboardAdminsController.newOrder')
    Route.get('count-new-order', 'DashboardAdminsController.newOrderCount')
    Route.get('count-order', 'DashboardAdminsController.countOrder')
    Route.get('total-sales', 'DashboardAdminsController.totalSales')

}).prefix('/api/dashboard')
