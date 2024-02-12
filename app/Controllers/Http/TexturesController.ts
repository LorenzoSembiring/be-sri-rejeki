import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import User from 'App/Models/User'
import Product from 'App/Models/Product'

export default class TexturesController {
  public async get({ params, response }: HttpContextContract) {
    try {
      const product: Product | null = await Product.find(params.id)
      const path: string | undefined = product?.texture
      const data: string = "http://" + process.env.server! + "/" + path

      return response.status(200).json({
        code: 200,
        status: "success",
        data: data
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: "fail",
        message: error
      })
    }
  }
  public async update ({ params, request, response, auth }: HttpContextContract) {
    try {
      const usersController: UsersController = new UsersController()
      const user: User = await auth.authenticate()
      const role = await usersController.getRole(user)

      if(role == "admin"){
        const product: Product | null = await Product.find(params.id)
        const sanitized = product?.name.replace(/ +/g, '-')

        const file = request.file('file', {
          size: '10mb',
          extnames: ['jpg', 'PNG', 'JPEG']
        })

        await file?.moveToDisk('./texture',{
          name: sanitized + "." + file.extname,
          overwrite: true
        })
        const fileName = file?.fileName

        if (product != undefined && fileName != undefined) {
          product!.texture = "texture/" + fileName!
          await product.save()
        }

        return response.status(200).json({
          code: 200,
          status: "success",
          message: "Texture updated successfully"
        })
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
        message: error
      })
    }
  }
}
