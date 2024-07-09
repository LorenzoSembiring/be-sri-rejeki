import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import Size from 'App/Models/Size'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StocksController {
  public async getByProduct({ params, response }: HttpContextContract) {
    try {
      const productID = params.id

      const stok = await await Database.rawQuery(
        'select s.size, s.stock from sizes s WHERE s.product_id = :id ;',
        {
          id: productID,
        }
      )
      return response.status(200).json({
        code: 200,
        message: 'success',
        data: stok[0],
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'error',
        error: error.message,
      })
    }
  }
  public async update({ params, request, response, auth }: HttpContextContract) {
    const usersController = new UsersController()
    const { stok } = request.body()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      const stock = await Size.findBy('id', params.id)

      if (role == 'admin' && stock) {
        stock.stock = stok
        await stock.save()

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'update success',
        })
      } else if (role == 'admin' && !stock) {
        return response.status(404).json({
          code: 404,
          status: 'not found',
          message: 'Size not found',
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: 'Unauthorized',
          message: 'Your role access is not sufficient for this action',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: error,
      })
    }
  }
  public async stockCheck(IDsize) {
    try {
      const size = await Size.find(IDsize)
      const stock = size?.stock
      return stock
    } catch (error) {
      return null
    }
  }
}
