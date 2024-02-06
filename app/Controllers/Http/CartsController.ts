import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Cart from 'App/Models/Cart'

export default class CartsController {
  public async insertToCart({ request, response, auth }: HttpContextContract) {
    try {
      const { product_id, quantity } = request.body()
      const user = await auth.authenticate()
      const cart = await Cart.query()
      .where("user_id", user.id)
      .where("product_id", product_id)
      .first()
      const intQuantity = parseInt(quantity)
      const cartQuantity = parseInt(JSON.stringify(cart?.quantity))

      if (!user) {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'You should login first',
        })
      } else if(user && cart) {
        //handling when the cart for correspond product and user is exist, it will change the existing cart quantity
        cart.quantity = cartQuantity + intQuantity
        await cart.save()

        return response.status(200).json({
          code: 200,
          status: 'created',
          message: 'Cart added successfully',
          data: cart,
        })
      }
       else {
        const cart = await Cart.create({
          user_id: user.id,
          product_id: product_id,
          quantity: quantity,
        })
        return response.status(201).json({
          code: 201,
          status: 'created',
          message: 'Cart added successfully',
          data: cart,
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
  public async deleteCart({ params, response, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const cart = await Cart.find(params.id)
      if (!user) {
        return response.status(201).json({
          code: 401,
          status: 'unauthorized',
          message: 'You should login first',
        })
      } else if (cart?.user_id != user.id) {
        return response.status(403).json({
          code: 403,
          status: 'forbiden',
          message: "You don't have permission to do this action"
        })
      } else if (cart?.user_id == user.id) {
        await cart?.delete()

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'Item removed from cart successfully',
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
  public async manageQuantity({ params, request, response, auth }: HttpContextContract) {
    try {
      const { quantity } = request.body()
      const user = await auth.authenticate()
      const cart = await Cart.find(params.id)

      if (!cart) {
        return response.status(404).json({
          code: 404,
          status: "not found",
          message: "Product not found!"
        })
      } else if(cart.user_id != user.id) {
        return response.status(403).json({
          code: 403,
          status: "forbiden",
          message: "You don't have permission to do this action"
        })
      } else {
        cart.quantity = quantity
        await cart.save()

        return response.status(200).json({
          code: 200,
          status: "success",
          message: "Cart updated"
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
  public async getUserCart({ request, response, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      if (!user) {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'You should login first',
        })
      } else {
        const cart = await Database
          .from('carts')
          .where('carts.user_id', user.id)
          .join('products', 'carts.product_id', '=', 'products.id')
          .select(
            'carts.quantity',
            'products.id',
            'products.name',
            'products.description',
            'products.price'
          )
          .paginate(request.input('page'), 10)

        return response.status(200).json({
          code: 200,
          status: 'success',
          data: cart
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
  public async totalPrice({ response, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      if (!user) {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'You should login first'
        })
      } else {
        const data = await Database
          .from('carts')
          .where('carts.user_id', user.id)
          .join('products', 'carts.product_id', '=', 'products.id')
          .select('products.price')
          .sum("price as total")

          return response.status(200).json({
            code: 200,
            status: 'success',
            data: data
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
}
