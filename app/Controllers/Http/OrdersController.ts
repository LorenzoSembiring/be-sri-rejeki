import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import User from 'App/Models/User'
import Order from 'App/Models/Order'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import OrderDetail from 'App/Models/OrderDetail'

export default class OrdersController {
  public async placingOrder({ request, response, auth }: HttpContextContract) {
    try {
      // Authenticate the user
      const user = await auth.authenticate()
      if (!user) {
        return response.status(401).json({
          code: 401,
          status: 'Unauthorized',
          message: 'You should login first',
        })
      }

      // Get cart_id from request body
      const { cart_id, kurir, ongkir, type_kurir } = request.body()

      // Generate a UUID for the order
      const UUID = uuidv4()

      // Parse the cart_id from the request
      let arrayCart
      try {
        arrayCart = Array.isArray(cart_id) ? cart_id : JSON.parse(cart_id)
      } catch (error) {
        return response.status(400).json({
          code: 400,
          status: 'Bad Request',
          message: 'Invalid cart_id format',
        })
      }

      // Extract ids from the array, handling different possible structures
      let ids
      if (Array.isArray(arrayCart)) {
        if (arrayCart.length > 0 && typeof arrayCart[0] === 'object' && arrayCart[0] !== null) {
          // If arrayCart is an array of objects, extract the id property
          ids = arrayCart.map((item) => item.id).filter((id) => id !== undefined)
        } else {
          // If arrayCart is an array of primitive values, use it directly
          ids = arrayCart.filter((id) => id !== undefined)
        }
      } else if (typeof arrayCart === 'object' && arrayCart !== null) {
        // If arrayCart is a single object, extract its id
        ids = [arrayCart.id].filter((id) => id !== undefined)
      } else {
        // If arrayCart is a single primitive value, use it directly
        ids = [arrayCart].filter((id) => id !== undefined)
      }

      if (ids.length === 0) {
        return response.status(400).json({
          code: 400,
          status: 'Bad Request',
          message: 'No valid cart ids provided',
        })
      }

      // Query the database for all cart items at once
      const carts = await Database.from('carts')
        .whereIn('id', ids)
        .andWhere('user_id', user.id)
        .select('id', 'user_id')

      if (carts.length !== ids.length) {
        return response.status(400).json({
          code: 400,
          status: 'Bad Request',
          message: 'Some cart items do not belong to the user or do not exist',
        })
      }

      await Database.from('carts').whereIn('id', ids).andWhere('user_id', user.id).update('status', 'checked_out')

      const order = await Order.create({
        user_id: user.id,
        kurir: kurir,
        type_kurir: type_kurir,
        ongkir: ongkir,
        midtrans_id: UUID,
        status: 'waiting for payment',
      })
      const cartArray = cart_id.slice(1, -1).split(',').map(Number)

      const totalCost = await this.getTotalCost(cart_id, ongkir)
      if (order) {
        cartArray.forEach(async (element) => {
          const cart = await Database.rawQuery(
            'SELECT c.quantity, s.product_id FROM carts c LEFT JOIN sizes s on s.id = c.size_id WHERE c.id = :cart;',
            {
              cart: element,
            }
          )
          await OrderDetail.create({
            order_id: order.id,
            product_id: cart[0][0].product_id,
            quantity: cart[0][0].quantity,
          })
        })
        try {
          const midtrans = await this.midtransPay(totalCost, UUID);


          const createdOrder = await Order.findOrFail(order.id);
          createdOrder.midtrans_token = midtrans.token;

          await createdOrder.save();
          return response.status(200).json({
            code: 200,
            status: 'success',
            message: 'Order palced',
            data: {
              midtrans,
              createdOrder
            }
          })
        } catch (error) {
          console.error('Error updating order with midtrans token:', error);
        }
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: error.message
      })
    }
  }
  private async midtransPay(amount: number, uuid: string) {
    const url = 'https://app.sandbox.midtrans.com/snap/v1/transactions'
    const data = {
      transaction_details: { order_id: uuid, gross_amount: amount },
      credit_card: { secure: true },
    }

    const config = {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': process.env.MIDTRANS_KEY,
      },
    }

    try {
      const response = await axios.post(url, data, config)
      return response.data
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message)
      throw error
    }
  }
  public async midtransStatus({ params, response }: HttpContextContract) {
    const ORDER_ID = params.id
    const link = `https://api.sandbox.midtrans.com/v2/${ORDER_ID}/status`
    try {
      const data = axios.get(link, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': process.env.MIDTRANS_KEY,
        },
      })
      if ((await data).data.status_code == 200 && (await data).data.transaction_status == 'settlement') {
        await Database.from('orders').where('midtrans_id', ORDER_ID).update('status', 'processed')
      }
      return (await data).data
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error.message,
      })
    }
  }
  private async getTotalCost(cart_id: string, ongkir: any) {
    const cartArray = JSON.parse(cart_id)

    const data = await Database.rawQuery(
      'select sum(p.price * c.quantity) as price from carts c LEFT JOIN sizes s on s.id = c.size_id left join products p on p.id = s.product_id where c.id in ( :cart );',
      {
        cart: cartArray,
      }
    )
    return parseInt(data[0][0]?.price ?? 0) + parseInt(ongkir)
  }
  public async getWaitingPayment({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    try {
      const data = await Database.rawQuery(
        "SELECT o.id, o.status, DATE_FORMAT(o.created_at, '%d %M %Y') AS formatted_date, o.midtrans_id, o.midtrans_token, p.name, SUM(p.price * od.quantity) + o.ongkir AS 'total', pic.path FROM orders o LEFT JOIN order_details od ON od.order_id = o.id LEFT JOIN products p ON p.id = od.product_id LEFT JOIN pictures pic ON pic.product_id = p.id AND pic.index = 1 WHERE o.user_id = ? AND o.status = 'waiting for payment' GROUP BY o.id, p.name, o.ongkir, pic.path;",
        [user.id]
      )
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: data[0],
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        error: error.message,
      })
    }
  }
  public async getTransactionHistory({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    try {
      const data = await Database.rawQuery(
        "SELECT o.id, o.status, DATE_FORMAT(o.created_at, '%d %M %Y') AS formatted_date, o.midtrans_id, p.name, SUM(p.price * od.quantity) + o.ongkir AS 'total', pic.path FROM orders o LEFT JOIN order_details od ON od.order_id = o.id LEFT JOIN products p ON p.id = od.product_id LEFT JOIN pictures pic ON pic.product_id = p.id AND pic.index = 1 WHERE o.user_id = ? GROUP BY o.id, p.name, o.ongkir, pic.path;",
        [user.id]
      )
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: data[0],
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        error: error.message,
      })
    }
  }
  public async adminIndex({ request, response, auth }: HttpContextContract) {
    const usersController = new UsersController()
    const user = await auth.authenticate()
    var role = await usersController.getRole(user)

    if (role !== 'admin') {
      return response.status(401).json({
        code: 401,
        status: 'Unauthorized',
        message: 'Your role access is not sufficient for this action',
      })
    }
    try {
      const reqQuery = request.qs()
      const data = await Database.rawQuery(
        "SELECT o.id, u.username, o.status, o.type_kurir, o.kurir, o.ongkir, DATE_FORMAT(o.created_at, '%d %M %Y') AS formatted_date, p.name, SUM(p.price * od.quantity) + o.ongkir AS 'total' FROM orders o LEFT JOIN order_details od ON od.order_id = o.id LEFT JOIN products p ON p.id = od.product_id LEFT JOIN users u ON o.user_id = u.id WHERE 1=1 AND (:month IS NULL OR MONTH(o.created_at) = :month) AND (:year IS NULL OR YEAR(o.created_at) = :year) GROUP BY o.id, p.name, o.ongkir;",
        {
          month: reqQuery.month,
          year: reqQuery.year,
        }
      )
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: data[0],
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        error: error.message,
      })
    }
  }
  public async checkResi({ request, response }: HttpContextContract) {
    try {
      var { courier, awb } = request.body();

      const data = await axios.get(`https://api.binderbyte.com/v1/track?api_key=${process.env.BINDERBYTE_KEY}&courier=${courier}&awb=${awb}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return response.status(200).json({
        code: 200,
        status: 'success',
        data: data.data.data
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
        });
      }
      return response.status(500).json({
        code: 500,
        status: 'failed',
        error: error.message,
      });
    }
  }

  public async addResi({ request, response, auth }: HttpContextContract) {
    const user = await auth.authenticate();
    const usersController = new UsersController()
    var role = await usersController.getRole(user)

    if (role !== 'admin') {
      return response.status(401).json({
        code: 401,
        status: 'Unauthorized',
        message: 'Your role access is not sufficient for this action',
      })
    }
    const {resi, order_id} = request.body()
    try {
      const order = await Order.find(order_id)
      order!.resi = resi
      order!.status = 'shipped'
      await order?.save()


      return response.status(200).json({
        code: 200,
        status: 'success',
        message: 'update success'
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        error: error.message,
      });
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
