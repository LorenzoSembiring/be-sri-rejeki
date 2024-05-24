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
}
