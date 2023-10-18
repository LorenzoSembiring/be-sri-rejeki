import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import UsersController from './UsersController'

export default class CategoriesController {
  public async store({ request, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const { name } = request.body()

      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      if (role === 'admin') {
        const category = await Category.create({
          name: name,
        })

        return response.status(201).json({
          code: '201',
          message: 'Category added successfully',
          data: category,
        })
      } else {
        return response.status(401).json({
          code: '401',
          message: 'Unauthorized',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: '500',
        error,
      })
    }
  }
  public async get({ params, response }: HttpContextContract) {
    try {
      const category = await Category.find(params.id)

      return response.status(200).json({
        code: '200',
        message: '200 ok',
        data: category,
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        error,
      })
    }
  }
  public async getAll({ response }: HttpContextContract) {
    try {
      const category = await Category.all()

      return response.status(200).json({
        code: '200',
        message: '200 ok',
        data: category,
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        error,
      })
    }
  }
  public async update({ request, response, params, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const input = request.only(['name'])

      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      if (role == 'admin') {
        const category = await Category.findBy('id', params.id)

        category?.merge(input)
        await category?.save()

        return response.status(200).json({
          code: '200',
          message: 'update success',
        })
      } else {
        return response.status(401).json({
          code: '401',
          message: 'unauthorized',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: '500',
        error,
      })
    }
  }
  public async destroy({ params, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      if (role == "admin") {
        const category = await Category.findBy('id', params.id)
        await category?.delete()
  
        return response.status(200).json({
          code: '200',
          message: "delete success"
        })        
      } else {
        return response.status(401).json({
            code: '401',
            message: "unauthorized"
          })      
      }
    } catch (error) {
        return response.status(500).json({
            code: "500",
            error
        })
    }
  }
}
