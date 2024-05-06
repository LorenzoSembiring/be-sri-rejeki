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

      const { name, description, price, category_id, size } = request.body()

      //return model of category or null if not found any
      const category = await Category.findBy('id', category_id)

      //role is admin and the category is exist (not null)
      if (role == 'admin' && category != null) {
        const product = await Product.create({
          name: name,
          description: description,
          price: price,
          category_id: category_id,
          status: "ACTIVE"
        })

        var arr = this.split(size)

        for (let index = 0; index < arr.length; index++) {
          await Size.create({
            product_id: product.id,
            size: arr[index]
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
        message: error,
      })
    }
  }
  public async getByCategory({ request, response }: HttpContextContract) {
    const category = request.input("category")
    try {
      const product = await Database.from('products').where({ category_id: category })
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: product
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: error
      })
    }
  }
  public async get({ params, response }: HttpContextContract) {
    try {
      const product = await Product.find(params.id)
      if (product) {
        return response.status(200).json({
          code: 200,
          status: "success",
          data: product
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: "not found"
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
        'SELECT p.id, p.name, p.description, p.price, c.name AS "category" FROM `products` AS p JOIN `categories` AS c ON p.category_id = c.id WHERE p.status = "ACTIVE" LIMIT :limit OFFSET :offset;',
        {
          limit: parseInt(req.limit),
          offset: req.page-1
        }
      )
      if (product[0].length > 0) {
        return response.status(200).json({
          code: 200,
          status: "success",
          data: product[0]
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: "not found"
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
        'SELECT p.id, p.name, p.description, p.price, p.status, c.name AS "category" FROM `products` AS p JOIN `categories` AS c ON p.category_id = c.id  LIMIT :limit OFFSET :offset;',
        {
          limit: parseInt(req.limit),
          offset: req.page-1
        }
      )
      if (product[0].length > 0) {
        return response.status(200).json({
          code: 200,
          status: "success",
          data: product[0]
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: "not found"
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
        message: error
      })
    }
  }
  private split(angka: string) {

    const stringed = JSON.stringify(angka)
    const strip = stringed.substring(1, stringed.length - 1)
    var arr: string[] = []

    const res = strip.split(',')
    arr = res

    var arrNumber: number[] = []
    for (let index = 0; index < arr.length; index++) {
      var parsed = parseInt(arr[index])
      arrNumber.push(parsed)
    }

    return arrNumber
    // return response.status(200).json({
    //   code: 200,
    //   data: arrNumber
    // })
  }
  public async activate( {params, response, auth}: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      const product = await Product.findBy('id', params.id)
      if (role == "admin" && product && product.status != "ACTIVE") {

        product.status = "ACTIVE";
        await product.save()

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'Product activated'
        })

      } else if (role == "admin" && product?.status == "ACTIVE") {
        return response.status(200).json({
          cde: 200,
          status: "success",
          mesage: "Product already activated"
        })
      }
       else if (product == null) {
        return response.status(404).json({
          cde: 404,
          status: "not found",
          mesage: "Product not found"
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'Your role access is not sufficient for this action'
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
  public async deactivate( {params, response, auth}: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      const product = await Product.findBy('id', params.id)
      if (role == "admin" && product && product.status != "DEACTIVE") {

        product.status = "DEACTIVE";
        await product.save()

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: 'Product deactivated'
        })

      } else if (role == "admin" && product?.status == "DEACTIVE") {
        return response.status(200).json({
          cde: 200,
          status: "success",
          mesage: "Product already deactivated"
        })
      }
       else if (product == null) {
        return response.status(404).json({
          cde: 404,
          status: "not found",
          mesage: "Product not found"
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: 'Your role access is not sufficient for this action'
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
  public async checkProduct(productID) {
    try {
      const product = await Product.find(productID)
      if(product) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return 0
    }
  }
}
