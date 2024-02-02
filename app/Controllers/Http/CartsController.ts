import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'

export default class CartsController {

  public async insertToCart({ request, response, auth }: HttpContextContract) {
    const {product_id, quanity} = request.body()
    const user = await auth.authenticate()
    try {
      if(!user) {
        return response.status(201).json({
          code: 401,
          status: "unauthorized",
          message: "You should login first",
        })
      } else {
        const cart = await Cart.create({
          user_id: user.id,
          product_id: product_id,
          quanity: quanity
        })
        return response.status(201).json({
          code: 201,
          status: "created",
          message: "Cart added successfully",
          data: cart
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
