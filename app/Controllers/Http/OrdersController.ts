import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

  public async checkShipping({ request, response }: HttpContextContract) {
    const { from, to, courier, weight } = request.body()

    try {
      const data = await axios.post(
        'https://api.rajaongkir.com/starter/cost',
        new URLSearchParams({
          origin: from,
          destination: to,
          weight: weight,
          courier: courier,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'key': process.env.RAJA_ONGKIR_KEY,
          },
        }
      )
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: data.data.rajaongkir.results[0].costs
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        status: 'fail',
        message: error.message,
      })
    }
  }
}
