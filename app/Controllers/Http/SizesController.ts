import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Size from 'App/Models/Size'
import Product from 'App/Models/Product'
import UsersController from './UsersController'

export default class SizesController {
  public async addSize({ auth, request, response }: HttpContextContract) {
    const { product_id, size } = request.body()
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      const product = await Product.findBy('id', product_id)

      if(role == "admin" && product) {

        const sizes = Size.create({
          product_id : product_id,
          size : size
        })

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'Product size added successfully',
          data: sizes
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
        message: error
      })
    }
  }
  public async deleteSize({ auth, response, params }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      if (role == "admin") {

        const size = await Size.findBy('id', params.id)
        await size?.delete()

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'Product size deleted successfully',
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
        status: "fail",
        message: error
      })

    }
  }
}
