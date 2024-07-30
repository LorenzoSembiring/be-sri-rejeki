import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Cart from 'App/Models/Cart'
import Size from 'App/Models/Size'
import StocksController from './StocksController'

export default class CartsController {
  public async insertToCart({ request, response, auth }: HttpContextContract) {
    try {
      const { size_id, quantity } = request.body()
      const user = await auth.authenticate()
      //get the cart
      const cart = await Cart.query()
      .where("user_id", user.id)
      .where("size_id", size_id)
      .first()
      // inputed quantity
      const intQuantity = parseInt(quantity)
      //initial quantity
      const cartQuantity = parseInt(JSON.stringify(cart?.quantity))
      //get stock
      const stockController = new StocksController()
      const paramSizeId = request.input('size_id')
      const sizeId = parseInt(paramSizeId)
      const stock = await stockController.stockCheck(sizeId)

      const isStockAvailable = stock! > 0 && stock! >= quantity;

      if (!user) {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'You should login first'
        })
      } else if(!isStockAvailable) {
        return response.status(400).json({
          code: 400,
          status: 'bad request',
          message: 'Stock unavailable'
        })
      }
       else if(user && cart && isStockAvailable) {
        //handling when the cart for correspond product and user is exist, it will change the existing cart quantity
        cart.quantity = cartQuantity + intQuantity
        await cart.save()

        const size = await Size.find(sizeId);
        if (size) {
          if (stock !== undefined) {
          size.stock -= intQuantity;
          }
          await size.save();
        }

        return response.status(200).json({
          code: 200,
          status: 'created',
          message: 'Cart added successfully',
          data: cart
        })
      }
      else {
        const cart = await Cart.create({
          user_id: user.id,
          size_id: size_id,
          quantity: quantity,
        })

        const size = await Size.find(sizeId);
        if (size) {
          if (stock !== undefined) {
          size.stock -= 1;
          }
          await size.save();
        }

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
      const size = await Size.findBy("id", cart?.size_id)
      const initialStock = size?.stock
      const initialQuantity = cart?.quantity
      const difference = (initialQuantity ?? 0) - quantity;

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

        size!.stock = (initialStock ?? 0) + difference
        await size?.save()

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
        message: error.message
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
          .where('pictures.index', 1)
          .join('sizes', 'carts.size_id', '=', 'sizes.id')
          .join('products', 'sizes.product_id', '=', 'products.id')
          .join('pictures', 'pictures.product_id', '=', 'products.id')
          .select(
            'carts.quantity',
            'carts.id',
            'products.id as product_id',
            'products.name',
            'sizes.size',
            'sizes.stock',
            'products.description',
            'products.price',
            'pictures.path'
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
  public async get({ params, response, auth }: HttpContextContract) {
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
          .where('carts.id', params.id)
          .join('sizes', 'carts.size_id', '=', 'sizes.id')
          .join('products', 'sizes.product_id', '=', 'products.id')
          .select(
            'carts.quantity',
            'products.id',
            'products.name',
            'sizes.size',
            'sizes.stock',
            'products.description',
            'products.price'
          )
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: cart[0]
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
          .join('sizes', 'carts.size_id', '=', 'sizes.id')
          .join('products', 'sizes.product_id', '=', 'products.id')
          .select('products.price')
          .sum("price as total")

          return response.status(200).json({
            code: 200,
            status: 'success',
            data: data[0]
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
  public async getProductID({ params}: HttpContextContract) {
    try {
      const data = await Database.rawQuery('select s.product_id from carts c LEFT JOIN sizes s ON c.id = s.id where c.id = ?;',
        [params.id]
      )
      return data[0][0].product_id
    } catch (error) {
      return 0
    }
  }
}
