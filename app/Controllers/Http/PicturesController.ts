import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import ProductsController from './ProductsController'
import Application from '@ioc:Adonis/Core/Application'
import Picture from 'App/Models/Picture'


export default class PicturesController {
  public async store({ request, response, auth }: HttpContextContract) {
    try {

      const {product_id} = request.body()

      const usersController = new UsersController()
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)

      const productController = new ProductsController()
      const product = await productController.checkProduct(product_id)

      if(role == "admin") {
        if (product) {

          const file = request.file('file', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg']
          })

          await file?.moveToDisk('./')
          const fileName = file?.fileName

          const picture = await Picture.create({
            product_id: product_id,
            path: fileName
          })

          return response.status(201).json({
            code: 201,
            status: "created",
            data: picture
          })

        } else {
          return response.status(404).json({
            code: 404,
            status: "not found",
            message: "Product not found"
          })
        }
      } else {
        return response.status(401).json({
          code: 401,
          status: "Unauthorized",
          message: "Your role access is not sufficient for this action"
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: "fail",
        message: error,

      })
    }
  }

  private async pictureCheck(user, path) {

    const usersController = new UsersController()
    const role = await usersController.getRole(user)

    try {
      if(role =="admin"){

        const picture = await Picture.findBy("path", path)

      if (picture) {
        return true
      } else {
        return false
      }
    }
    } catch (error) {
      return false
    }
  }
}
