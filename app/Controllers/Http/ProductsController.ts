import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import Product from 'App/Models/Product'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import Size from 'App/Models/Size'

export default class ProductsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)

      const { name, description, price, category_id, size, mesh_id } = request.body()

      const file = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      const picture = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      await file?.moveToDisk('./texture')
      const fileName = file?.fileName

      //return model of category or null if not found any
      const category = await Category.findBy('id', category_id)

      //role is admin and the category is exist (not null)
      if (role == 'admin' && category != null) {
        const product = await Product.create({
          name: name,
          description: description,
          price: price,
          category_id: category_id,
          status: 'ACTIVE',
          mesh_id: mesh_id,
          texture: "/uploads/texture/" + fileName,
        })

        const json = JSON.parse(size)
        for (let item of json) {
          await Size.create({
            product_id: product.id,
            size: item.size,
            stock: item.stock,
          })
        }

        return response.status(201).json({
          code: 201,
          status: 'success',
          message: 'Product added succesfully',
          data: product,
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
        message: error.message,
      })
    }
  }
  public async getByCategory({ request, response }: HttpContextContract) {
    const category = request.input('category')
    try {
      const product = await Database.from('products').where({ category_id: category })
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: product,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: error,
      })
    }
  }
  public async get({ params, response }: HttpContextContract) {
    try {
      const product = await Database.rawQuery(
        'select p.*, c.name as category from products p JOIN categories c ON c.id = p.category_id where p.id = ?;',
        [params.id]
      )
      if (product) {
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: product[0][0],
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: 'not found',
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
  public async getPaginated({ request, response }: HttpContextContract) {
    const req = request.qs()
    try {
      const product = await await Database.rawQuery(
        'SELECT p.id, p.name, p.description, p.price, p.status, c.name AS "category", c.id AS "category_id", pic.path AS "picture" FROM `products` AS p JOIN `categories` AS c ON p.category_id = c.id LEFT JOIN `pictures` AS pic ON pic.product_id = p.id AND pic.index = 1 WHERE p.status = "ACTIVE" ORDER BY p.id ASC LIMIT :limit OFFSET :offset;',
        {
          limit: parseInt(req.limit),
          offset: req.page - 1,
        }
      )
      if (product[0].length > 0) {
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: product[0],
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: 'not found',
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
  public async indexPaginated({ request, response }: HttpContextContract) {
    const req = request.qs()
    try {
      const product = await await Database.rawQuery(
        'SELECT p.id, p.name, p.description, p.price, c.name AS "category" FROM `products` AS p JOIN `categories` AS c ON p.category_id = c.id WHERE p.status = "ACTIVE" LIMIT :limit OFFSET :offset;',
        {
          limit: parseInt(req.limit),
          offset: req.page - 1,
        }
      )
      if (product[0].length > 0) {
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: product[0],
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: 'not found',
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
  public async getAdmin({ request, response }: HttpContextContract) {
    const req = request.qs()
    try {
      const product = await await Database.rawQuery(
        'SELECT p.id, p.name, p.description, p.price, p.status, c.name AS "category", pic.path AS "picture" FROM `products` AS p JOIN `categories` AS c ON p.category_id = c.id LEFT JOIN `pictures` AS pic ON pic.product_id = p.id AND pic.index = 1 ORDER BY p.id ASC LIMIT :limit OFFSET :offset;',
        {
          limit: parseInt(req.limit),
          offset: req.page - 1,
        }
      )
      if (product[0].length > 0) {
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: product[0],
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: 'not found',
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
  public async update({ params, request, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)
      if (role === 'admin') {
        const input = request.only(['name', 'description', 'price', 'category_id'])

        const product = await Product.findBy('id', params.id)
        product?.merge(input)
        await product?.save()

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'update success',
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
        status: 'fail',
        message: error,
      })
    }
  }
  public async updatePrice({ params, request, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)
      if (role === 'admin') {
        const input = request.only(['price'])

        const product = await Product.findBy('id', params.id)
        product?.merge(input)
        await product?.save()

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'update price success',
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
        status: 'fail',
        message: error,
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
          code: 200,
          status: 'success',
          message: 'Product deleted successfully',
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
        status: 'fail',
        message: error,
      })
    }
  }
  public async activate({ params, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      const product = await Product.findBy('id', params.id)
      if (role == 'admin' && product && product.status != 'ACTIVE') {
        product.status = 'ACTIVE'
        await product.save()

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'Product activated',
        })
      } else if (role == 'admin' && product?.status == 'ACTIVE') {
        return response.status(200).json({
          cde: 200,
          status: 'success',
          mesage: 'Product already activated',
        })
      } else if (product == null) {
        return response.status(404).json({
          cde: 404,
          status: 'not found',
          mesage: 'Product not found',
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
        status: 'fail',
        message: error,
      })
    }
  }
  public async deactivate({ params, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      const product = await Product.findBy('id', params.id)
      if (role == 'admin' && product && product.status != 'DEACTIVE') {
        product.status = 'DEACTIVE'
        await product.save()

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'Product deactivated',
        })
      } else if (role == 'admin' && product?.status == 'DEACTIVE') {
        return response.status(200).json({
          cde: 200,
          status: 'success',
          mesage: 'Product already deactivated',
        })
      } else if (product == null) {
        return response.status(404).json({
          cde: 404,
          status: 'not found',
          mesage: 'Product not found',
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
        status: 'fail',
        message: error,
      })
    }
  }
  public async checkProduct(productID) {
    try {
      const product = await Product.find(productID)
      if (product) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return 0
    }
  }
}
