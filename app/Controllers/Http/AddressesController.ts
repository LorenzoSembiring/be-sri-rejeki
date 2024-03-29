import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import UsersController from './UsersController'

export default class AddressesController {
  public async store({ request, response, auth }: HttpContextContract) {
    const usersController = new UsersController()

    try {
      const user = await auth.authenticate()
      var role = await usersController.getRole(user)

      if (role === 'admin') {
        const { user_id, jalan, kelurahan, kecamatan, kota, provinsi, kode_pos } = request.body()

        const address = await Address.create({
          user_id: user_id,
          jalan: jalan,
          kelurahan: kelurahan,
          kecamatan: kecamatan,
          kota: kota,
          provinsi: provinsi,
          kode_pos: kode_pos,
        })

        return response.status(201).json({
          code: 201,
          status: "success",
          data: address
        })
      } else {
        const { jalan, kelurahan, kecamatan, kota, provinsi, kode_pos } = request.body()

        const address = await Address.create({
          user_id: user.id,
          jalan: jalan,
          kelurahan: kelurahan,
          kecamatan: kecamatan,
          kota: kota,
          provinsi: provinsi,
          kode_pos: kode_pos,
        })

        return response.status(201).json({
          code: 201,
          status: "success",
          data: address
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

  public async get({ auth, response }: HttpContextContract) {
    const user = await auth.authenticate()
    const userID = user.id

    try {
      const address = await Database.from('addresses').where({ user_id: userID })

      return response.status(200).json({
        code: 200,
        status: "success",
        data: address,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: "fail",
        message: error,
      })
    }
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    const input = request.only(['jalan', 'kelurahan', 'kecamatan', 'kota', 'provinsi', 'kode_pos'])
    const user = await auth.authenticate()
    const userID = user.id

    try {
      const address = await Address.findBy('id', params.id)
      if (address?.user_id == userID) {
        address?.merge(input)
        await address?.save()

        return response.status(200).json({
          code: '200',
          status: 'Update success',
        })
      } else {
        return response.status(401).json({
          code: '401',
          status: 'unauthorized',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: '500',
        status: "fail",
        message: error,
      })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const userID = user.id
    try {
      const address = await Address.findBy('id', params.id)
      if (address?.user_id == userID) {
        await address?.delete()
      }

      return response.status(200).json({
        code: '200',
        message: 'delete success',
      })
    } catch (error) {
      return response.status(500).json({
        error,
      })
    }
  }
}
