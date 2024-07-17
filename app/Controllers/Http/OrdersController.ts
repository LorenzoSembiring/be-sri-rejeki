import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import User from 'App/Models/User'
import Order from 'App/Models/Order'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios'

export default class OrdersController {
  public async placingOrder({ request, response, auth }: HttpContextContract) {
    const { cart_id } = request.body()
    try {
      const user: User = await auth.authenticate()

      if (!user) {
        return response.status(401).json({
          code: 401,
          status: 'Unauthorized',
          message: 'Your should login first',
        })
      }
      //check if the cart is owned by right user
      const cart = Database.rawQuery('SELECT `user_id` FROM `carts` WHERE id = :cart;', {
        cart: cart_id,
      })
      return response.status(200).json({
        data: cart[0],
      })

      // if (cart) {
      //   const order: Order = await Order.create({
      //     user_id: user.id,
      //     status: orderStatus.pending
      //   })

      //   return response.status(200).json({
      //     code: 200,
      //     status: "success",
      //     message: "Order placed",
      //     data: order
      //   })

      // }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: error,
      })
    }
  }

  public async checkShipping({ request, response }: HttpContextContract) {
    const { from, to, courier, weight } = request.body()

    try {
      const data = await axios.post(
        'https://api.rajaongkir.com/starter/cost',
        new URLSearchParams({
          origin: from,
          destination: to,
          weight: weight,
          courier: courier,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'key': process.env.RAJA_ONGKIR_KEY,
          },
        }
      )
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: data.data.rajaongkir.results[0].costs
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: error.message,
      })
    }
  }
  public async storeProvince() {
    try {

    } catch (error) {
      console.log(`error: ${error.message}`)
    }
  }

  public async getProvince({ request, response }: HttpContextContract) {
    const name = request.body()
    try {
      const fetchData = await axios.get(
        'https://api.rajaongkir.com/starter/province',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'key': process.env.RAJA_ONGKIR_KEY,
          },
        }
      )

      const data: Array = fetchData.data.rajaongkir.results
      const split = data.
      console.log(data)
      function getIdByProvinceName(name) {
        const result = data.find(item => item.province === name);
        if (result) {
            return result.province_id;
        } else {
            return null;
        }
    }

    // getIdByProvinceName(name)

      return response.status(200).json({
        code: 200,
        status: 'success',
        data: data
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: error.message,
      })
    }
  }
}

enum orderStatus {
  pending = 'pending',
  waitingPayment = 'waiting for payment',
  processed = 'processed',
  shipped = 'shipped',
  delivered = 'delivered',
  canceled = 'canceled',
  completed = 'completed',
}
