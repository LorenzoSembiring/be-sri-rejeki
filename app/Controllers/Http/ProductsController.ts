import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import Product from 'App/Models/Product'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'

export default class ProductsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)
      
      const { name, description, price, size, category_id } = request.body()
      
      //return model of category or null if not found any
      const category = await Category.findBy('id', category_id)

      //role is admin and the category is exist (not null)
      if (role == 'admin' && category != null) {

        const product = await Product.create({
          name: name,
          description: description,
          price: price,
          size: size,
          category_id: category_id,
        })

        return response.status(201).json({
          code: '201',
          message: 'Product added succesfully',
          data: product,
        })
      } else {
        return response.status(401).json({
          code: '401',
          message: 'Unauthorized user',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: 'Invalid Token',
      })
    }
  }
  public async get({ request, response }: HttpContextContract) {
    const category = request.body()
    try {
      const product = await Database.from("products").where({category_id : category})
      return response.status(200).json({
        code: "200",
        data: product
      })
    } catch (error) {
      return response.status(500).json({
        code: "500",
        error
      })
    }
  }
  public async getAll({ response }: HttpContextContract) {
    try {
      const product = await Product.all()

      return response.status(200).json({
        code: '200',
        message: '200 ok',
        data: product,
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        error,
      })
    }
  }
  public async update({ params, request, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)
      if (role === 'admin') {
        const input = request.only(['name', 'description', 'price', 'size', 'category_id'])

        const product = await Product.findBy('id', params.id)
        product?.merge(input)
        await product?.save()

        return response.status(200).json({
          code: '200',
          message: 'update success',
        })
      } else {
        return response.status(401).json({
          code: '401',
          message: 'Unauthorized user',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: 'Invalid Token',
      })
    }
  }
  public async destroy({ params, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      if (role === 'admin') {
        const product = await Product.findBy('id', params.id)
        await product?.delete()

        return response.status(200).json({
          code: '200',
          message: 'Product deleted successfully',
        })
      } else {
        return response.status(401).json({
          code: '401',
          message: 'Unauthorized user',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: 'Invalid Token',
      })
    }
  }
}
