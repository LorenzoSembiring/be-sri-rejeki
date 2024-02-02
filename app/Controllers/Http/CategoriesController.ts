import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import UsersController from './UsersController'
import Database from '@ioc:Adonis/Lucid/Database'

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
          code: 201,
          status: "created",
          message: "Category added successfully",
          data: category,
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: "Unauthorized",
          message: "Your role access is not sufficient for this action"
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: '500',
        status: "fail",
        message: error
      })
    }
  }
  public async get({ params, response }: HttpContextContract) {
    try {
      const category = await Category.find(params.id)

      return response.status(200).json({
        code: 200,
        status: 'success',
        data: category,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: "fail",
        message: error,
      })
    }
  }
  public async getAll({ request, response }: HttpContextContract) {
    try {
      const category = await Database
      .from('categories')
      .paginate(request.input('page'), request.input('limit'))

      return response.status(200).json({
        code: 200,
        status: "success",
        data: category,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: "fail",
        message: error,
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
          code: 200,
          status: "success",
          message: "update success",
        })
      } else {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          message: "Your role access is not sufficient for this action"
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
  public async destroy({ params, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      if (role == "admin") {
        const category = await Category.findBy('id', params.id)
        await category?.delete()

        return response.status(200).json({
          code: 200,
          status: "success",
          message: "delete success"
        })
      } else {
        return response.status(401).json({
            code: 401,
            status: "unauthorized",
            message: "Your role access is not sufficient for this action"
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
