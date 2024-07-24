import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import UsersController from './UsersController'

export default class DashboardAdminsController {
  public async newOrder({ auth, response }: HttpContextContract) {
    const usersController = new UsersController()
    const user = await auth.authenticate()
    var role = await usersController.getRole(user)

    if (role !== 'admin') {
      return response.status(401).json({
        code: 401,
        status: "Unauthorized",
        message: "Your role access is not sufficient for this action"
      })
    }
    try {
      const data = await Database.rawQuery("SELECT o.id, u.username, o.status, DATE_FORMAT(o.created_at, '%d %M %Y') AS formatted_date, p.name, SUM(p.price * od.quantity) + o.ongkir AS 'total' FROM orders o LEFT JOIN order_details od ON od.order_id = o.id LEFT JOIN products p ON p.id = od.product_id LEFT JOIN users u on o.user_id = u.id WHERE o.status = 'waiting for payment' OR o.status = 'pending' GROUP BY o.id, p.name, o.ongkir;")
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: data[0]
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        error: error.message
      })
    }
  }
  public async newOrderCount({ auth, response }: HttpContextContract) {
    const usersController = new UsersController()
    const user = await auth.authenticate()
    var role = await usersController.getRole(user)

    if (role !== 'admin') {
      return response.status(401).json({
        code: 401,
        status: "Unauthorized",
        message: "Your role access is not sufficient for this action"
      })
    }
    try {
      const data = await Database.rawQuery("SELECT COUNT(id) as total FROM `orders` WHERE status = 'waiting for payment' OR status = 'pending';")
      return response.status(500).json({
        code: 500,
        status: 'fail',
        data: data[0][0].total
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        error: error.message
      })
    }
  }
  public async countOrder({ auth, response }: HttpContextContract) {
    const usersController = new UsersController()
    const user = await auth.authenticate()
    var role = await usersController.getRole(user)

    if (role !== 'admin') {
      return response.status(401).json({
        code: 401,
        status: "Unauthorized",
        message: "Your role access is not sufficient for this action"
      })
    }
    try {
      const data = await Database.rawQuery("SELECT COUNT(id)as total FROM `orders`;")
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: data[0][0].total
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        error: error.message
      })
    }
  }
  public async totalSales({ auth, response }: HttpContextContract) {
    const usersController = new UsersController()
    const user = await auth.authenticate()
    var role = await usersController.getRole(user)

    if (role !== 'admin') {
      return response.status(401).json({
        code: 401,
        status: "Unauthorized",
        message: "Your role access is not sufficient for this action"
      })
    }
    try {
      const data = await Database.rawQuery("SELECT SUM(total) AS total_sum FROM ( SELECT SUM(p.price * od.quantity) AS total FROM orders o LEFT JOIN order_details od ON od.order_id = o.id LEFT JOIN products p ON p.id = od.product_id GROUP BY o.id, p.name, o.ongkir ) AS subquery;")
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: data[0][0].total_sum
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        error: error.message
      })
    }
  }
}
