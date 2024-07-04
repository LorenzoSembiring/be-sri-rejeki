import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('user-count', 'StatisticsController.getUserCount')
  Route.get('product-count', 'StatisticsController.getProductCount')
  Route.get('order-count', 'StatisticsController.getOrderCount')
  Route.get('sales-sum', 'StatisticsController.getSalesSum')
  Route.get('best-seller', 'StatisticsController.getBestSeller')
}).prefix('/api/statistic')
