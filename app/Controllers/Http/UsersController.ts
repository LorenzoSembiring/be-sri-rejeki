import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
  public async register({ request, response, auth }: HttpContextContract) {
    const { email, password, username, phone, first_name, last_name } = request.body()

    const existedUser = await User.query().where({ email: email }).first()
    if (existedUser) {
      return response.status(422).json({
        message: 'email telah terdaftar',
      })
    }

    const hashedPassword = await Hash.make(password)
    const user = await User.create({
      email: email,
      password: hashedPassword,
      username: username,
      phone: phone,
      first_name: first_name,
      last_name: last_name
    })

    const token = await auth.use('api').generate(user, {
      expiresIn: '3 hours',
    })
    return response.json({
      data: {
        user: user,
        token: token,
      },
    })
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.body()

    const user = await User.query().where({ email: email }).first()
    if (!user) {
      return response.status(422).json({
        message: 'Email salah',
      })
    }

    if (!(await Hash.verify(user.password, password))) {
      return response.status(422).json({
        message: 'email atau password salah',
      })
    }

    const token = await auth.use('api').generate(user, {
      expiresIn: '3 hours',
    })
    return response.json({
      data: {
        user: user,
        token: token,
      },
    })
  }

  public async logout( {response, auth}: HttpContextContract ) {
    await auth.use('api').revoke()
    return {
      revoked: true
    }
  }
}
