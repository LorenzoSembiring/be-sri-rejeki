import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import UsersController from './UsersController'

export default class AddressesController {
  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const isAdmin = user.role === 'admin'

      let user_id = user.id

      if (isAdmin) {
        user_id = request.input('user_id')
        if (!user_id) {
          return response.status(400).json({
            code: 400,
            status: 'fail',
            message: 'user_id is required for admin to input address for another user',
          })
        }
      }

      const { name, phone, jalan, kelurahan, kecamatan, kota, provinsi, kode_pos } = request.body()

      const countedAddresses = await Database.from('addresses')
        .where('user_id', user_id)
        .count('* as count')
      const hasAddresses = countedAddresses[0].count > 0

      const selected = !hasAddresses

      const addressData = {
        name,
        phone,
        user_id,
        jalan,
        kelurahan,
        kecamatan,
        kota,
        provinsi,
        kode_pos,
        selected,
      }

      const address = await Address.create(addressData)

      return response.status(201).json({
        code: 201,
        status: 'success',
        data: address,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: 'Failed to store address. ' + error.message,
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
        status: 'success',
        data: address,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: error,
      })
    }
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    const input = request.only([
      'name',
      'phone',
      'jalan',
      'kelurahan',
      'kecamatan',
      'kota',
      'provinsi',
      'kode_pos',
    ])
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
        status: 'fail',
        message: error,
      })
    }
  }
  public async selectAddress({ params, response, auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const userID = user.id
    try {
      const address = await Address.findBy('id', params.id)
      const selectedAddress = await Address.query()
        .where('user_id', userID)
        .andWhere('selected', true)
        .first()
      // const isSelected = address?.selected
      // const selected = !isSelected

      if (address?.user_id == userID) {
        await address.merge({ selected: true }).save()
        await selectedAddress?.merge({ selected: false }).save()
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
        status: 'fail',
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
