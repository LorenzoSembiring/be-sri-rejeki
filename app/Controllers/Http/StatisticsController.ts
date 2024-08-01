import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StatisticsController {
  public async getUserCount({ auth, response }: HttpContextContract) {
    const usersController = new UsersController()
    try {
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)

      if (role == 'admin') {
        const data = await Database.from('users').where('role', 'user').count('* as total')
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data[0].total
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'Your role access is not sufficient for this action',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error,
      })
    }
  }
  public async getProductCount({ auth, response }: HttpContextContract) {
    const usersController = new UsersController()
    try {
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)

      if (role == 'admin') {
        const data = await Database.from('products').count('* as total')
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data[0].total
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'Your role access is not sufficient for this action',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error,
      })
    }
  }
  public async getSalesSum({ auth, response }: HttpContextContract) {
    const usersController = new UsersController()
    try {
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)

      if (role == 'admin') {
        const data = await Database.from('orders').count('* as total')
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data[0].total
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'Your role access is not sufficient for this action',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error,
      })
    }
  }
  public async getOrderCount({ auth, response }: HttpContextContract) {
    const usersController = new UsersController()
    try {
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)

      if (role == 'admin') {
        const data = await Database.from('orders').count('* as total')
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data[0].total
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'Your role access is not sufficient for this action',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error,
      })
    }
  }
  public async getBestSeller({ auth, response }: HttpContextContract) {
    const usersController = new UsersController()
    try {
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)

      if (role == 'admin') {
        var data = await Database.rawQuery(
          'SELECT p.name, p.price, pc.path AS picture, SUM(od.quantity) AS sales FROM order_details od JOIN products p ON od.product_id = p.id LEFT JOIN pictures pc ON pc.product_id = p.id AND pc.index = 1 GROUP BY p.name, p.price, pc.path ORDER BY sales DESC LIMIT 3;'
        )
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data[0]
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'Your role access is not sufficient for this action',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error,
      })
    }
  }
  public async getDailyOrderOnWeek({ auth, response }: HttpContextContract) {
    const usersController = new UsersController()
    try {
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)

      if (role == 'admin') {
        var data = await Database.rawQuery(
          'WITH RECURSIVE DateRange AS ( SELECT CURDATE() - INTERVAL 6 DAY AS `date` UNION ALL SELECT `date` + INTERVAL 1 DAY FROM DateRange WHERE `date` + INTERVAL 1 DAY <= CURDATE() ) SELECT COUNT(o.id) AS `total`, d.`date`, DAYNAME(d.`date`) AS `day` FROM DateRange d LEFT JOIN `orders` o ON DATE(o.created_at) = d.`date` GROUP BY d.`date` ORDER BY d.`date` ASC LIMIT 7;'
        )
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data[0]
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'Your role access is not sufficient for this action',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error,
      })
    }
  }
}
