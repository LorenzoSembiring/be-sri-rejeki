import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import Mesh from 'App/Models/Mesh'
import User from 'App/Models/User'
import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'

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
          extnames: ['glTF', 'obj', 'fbx', 'glb']
        })

        await file?.moveToDisk('./mesh',{
          name: sanitized + "." + file.extname,
          overwrite: true
        })
        const fileName = file?.fileName

        const mesh = await Mesh.create({
          name: name,
          path: "/uploads/mesh/" + fileName
        })

        return response.status(201).json({
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
  public async index({ response, auth }: HttpContextContract) {
    const usersController = new UsersController()
    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)
      if (role === 'admin') {

        const data = await Mesh.all()

        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data
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
        message: error.message
      })
    }
  }
  public async get({ params, response }: HttpContextContract) {
    try {

      const mesh = await Mesh.find(params.id)

      return response.status(200).json({
        code: 200,
        status: "success",
        data: mesh
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
      const { name } = request.body()
      const sanitized = name.replace(/ +/g, '-')
      const mesh: Mesh | null = await Mesh.find(params.id)
      const oldpath: string | undefined = mesh?.path

      if (role == "admin") {
        if (mesh) {
          mesh.name = name

          const file = request.file('file', {
            size: '50mb',
            extnames: ['glTF', 'obj', 'fbx']
          })

          if (file) {
            await file.moveToDisk('./mesh', {
              name: sanitized + "." + file.extname,
              overwrite: true
            })
            const fileName = file.fileName
            mesh.path = "/uploads/mesh/" + fileName
            if (oldpath) {
              await Drive.delete(oldpath)
            }
          }

          await mesh.save()

          return response.status(200).json({
            code: 200,
            status: "success",
            message: "Mesh updated successfully"
          })
        } else {
          return response.status(404).json({
            code: 404,
            status: "fail",
            message: "Mesh not found"
          })
        }
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
        message: error.message
      })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      const usersController: UsersController = new UsersController()
      const user: User = await auth.authenticate()
      const role: string = await usersController.getRole(user)
      const mesh: Mesh | null = await Mesh.find(params.id)
      if (role == "admin") {
        if (mesh) {

          await Drive.delete(mesh?.path)
          await mesh.delete()

          return response.status(200).json({
            ccode: 200,
            status: "success",
            message: "Picture removed successfully!"
          })
        }
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
  public async get3D({ params, response }: HttpContextContract) {
    try {
      const data = await Database.rawQuery(
        'SELECT p.id, p.texture, m.path FROM products p LEFT JOIN meshes m ON p.mesh_id = m.id WHERE p.id = ?;',
        [params.id]
      )

      return response.status(200).json({
        code: 200,
        status: "success",
        data: data[0][0]
      })

    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: "fail",
        message: error
      })
    }
  }
}
