import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'

export default class AddressesController {
  public async store({ request, response }: HttpContextContract) {
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
      code: '201',
      message: 'address successfully added',
      data: address,
    })
  }

  public async get({ auth, response }: HttpContextContract) {

    const user = await auth.authenticate()
    const userID = user.id

    try {
      const address = await Database.from('addresses').where({user_id: userID})

      return response.status(200).json({
        code: '200',
        message: 'success',
        data: address
      })
    } catch (error) {
      return response.status(500).json({
        code: '500',
        message: error
      })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const input = request.only(['jalan', 'kelurahan', 'kecamatan', 'kota', 'provinsi', 'kode_pos'])

    try {
      const address = await Address.findBy('id', params.id)
      
      address?.merge(input)
      await address?.save()

      return response.status(200).json({
        code: "200",
        message: "Update success"

      })
    } catch (error) {
      return response.status(500).json({
        code: "500",
        message: error
      })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const address = await Address.findBy('id', params.id)
      await address?.delete()

      return response.status(200).json({
        code: '200',
        message: "delete success"
      })
    } catch (error) {
      return response.status(500).json({
        error
      })
    }
  }
}
