import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import User from 'App/Models/User'
import Order from 'App/Models/Order'
import OrderDetail from 'App/Models/OrderDetail'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default class OrdersController {
  public async placingOrder({ request, response, auth }: HttpContextContract) {
    try {
      // Authenticate the user
      const user = await auth.authenticate();
      if (!user) {
        return response.status(401).json({
          code: 401,
          status: 'Unauthorized',
          message: 'You should login first',
        });
      }

      // Get cart_id from request body
      const { cart_id, kurir, ongkir, type_kurir } = request.body();

      // Generate a UUID for the order
      const UUID = uuidv4();

      // Parse the cart_id from the request
      let arrayCart;
      try {
        arrayCart = Array.isArray(cart_id) ? cart_id : JSON.parse(cart_id);
      } catch (error) {
        return response.status(400).json({
          code: 400,
          status: 'Bad Request',
          message: 'Invalid cart_id format',
        });
      }

      // Extract ids from the array, handling different possible structures
      let ids;
      if (Array.isArray(arrayCart)) {
        if (arrayCart.length > 0 && typeof arrayCart[0] === 'object' && arrayCart[0] !== null) {
          // If arrayCart is an array of objects, extract the id property
          ids = arrayCart.map(item => item.id).filter(id => id !== undefined);
        } else {
          // If arrayCart is an array of primitive values, use it directly
          ids = arrayCart.filter(id => id !== undefined);
        }
      } else if (typeof arrayCart === 'object' && arrayCart !== null) {
        // If arrayCart is a single object, extract its id
        ids = [arrayCart.id].filter(id => id !== undefined);
      } else {
        // If arrayCart is a single primitive value, use it directly
        ids = [arrayCart].filter(id => id !== undefined);
      }


      if (ids.length === 0) {
        return response.status(400).json({
          code: 400,
          status: 'Bad Request',
          message: 'No valid cart ids provided',
        });
      }

      // Query the database for all cart items at once
      const carts = await Database
        .from('carts')
        .whereIn('id', ids)
        .andWhere('user_id', user.id)
        .select('id', 'user_id');

      if (carts.length !== ids.length) {
        return response.status(400).json({
          code: 400,
          status: 'Bad Request',
          message: 'Some cart items do not belong to the user or do not exist',
        });
      }

      const order = await Order.create({
        user_id: 1,
        kurir: kurir,
        type_kurir: type_kurir,
        ongkir: ongkir,
        midtrans_id: UUID,
        status: 'waiting for payment'
      })

      if(order) {
        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'Order palced',
          data: order,
        });
      }

    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: 'An error occurred while processing the order',
      });
    }
  }
  private async getTotalCost(cart_id: string, ongkir: any) {
    const cartArray = JSON.parse(cart_id)

    const data = await Database.rawQuery('select sum(p.price * c.quantity) as price from carts c LEFT JOIN sizes s on s.id = c.size_id left join products p on p.id = s.product_id where c.id in ( :cart );', {
      cart: cartArray
    })
    return parseInt(data[0][0].price) + parseInt(ongkir)
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
