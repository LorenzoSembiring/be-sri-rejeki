import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import Mesh from 'App/Models/Mesh'
import User from 'App/Models/User'
import Drive from '@ioc:Adonis/Core/Drive'

export default class MeshesController {
  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const {name} = request.body()
      const sanitized = name.replace(/ +/g, '-')
      const usersController = new UsersController()
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)

      if (role == "admin") {

        const file = request.file('file', {
          size: '50mb',
          extnames: ['glTF', 'obj', 'fbx']
        })

        await file?.moveToDisk('./mesh',{
          name: sanitized + "." + file.extname,
          overwrite: true
        })
        const fileName = file?.fileName

        const mesh = await Mesh.create({
          path: "mesh/" + fileName
        })

        return response.status(200).json({
          code: 201,
          status: "created",
          message: "Mesh created successfully",
          data: mesh
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
        code: 500,
        status: "fail",
        message: error
      })
    }
  }
  public async get({ params, response }: HttpContextContract) {
    try {

      const mesh = await Mesh.find(params.id)
      const server: string = process.env.server!

      return response.status(200).json({
        code: 200,
        status: "success",
        data: "http://" + server + "/" + mesh?.path
      })

    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: "fail",
        message: error
      })
    }
  }
  public async update({ params, request, response, auth }: HttpContextContract) {
    try {

      const usersController: UsersController = new UsersController()
      const user: User = await auth.authenticate()
      const role: string = await usersController.getRole(user)
      const {name} = request.body()
      const sanitized = name.replace(/ +/g, '-')
      const mesh: Mesh | null = await Mesh.find(params.id)
      const oldpath: string | undefined = mesh?.path

      if(role == "admin") {

        const file = request.file('file', {
          size: '50mb',
          extnames: ['glTF', 'obj', 'fbx']
        })

        await file?.moveToDisk('./mesh',{
          name: sanitized + "." + file.extname,
          overwrite: true
        })
        const fileName = file?.fileName

        if (fileName != undefined && mesh != null) {
          mesh.name = name
          mesh.path = "mesh/" + fileName
          await mesh.save()
        }
        if (oldpath != undefined) {
          await Drive.delete(oldpath)
        }

        return response.status(200).json({
          code: 200,
          status: "success",
          message: "Mesh updated successfully"
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
        code: 500,
        status: "fail",
        message: error
      })
    }
  }

}
