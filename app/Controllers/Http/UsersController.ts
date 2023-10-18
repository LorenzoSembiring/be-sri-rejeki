import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UsersController {
  public async register({ request, response, auth }: HttpContextContract) {
    const { email, password, username, phone, first_name, last_name } = request.body()

    const existedUser = await User.query().where({ email: email }).first()
    if (existedUser) {
      return response.status(409).json({
        message: 'Email already taken',
      })
    }

    const hashedPassword = await Hash.make(password)
    const user = await User.create({
      email: email,
      password: hashedPassword,
      username: username,
      phone: phone,
      first_name: first_name,
      last_name: last_name,
    })

    const token = await auth.use('api').generate(user, {
      expiresIn: '3 hours',
    })

    return response.status(200).json({
      code: '200',
      message: 'user successfully registered',
      data: {
        user,
        token,
      },
    })
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.body()

    const user = await User.query().where({ email: email }).first()

    try {
      if (!user) {
        return response.status(401).json({
          message: 'Invalid email or password',
        })
      }

      if (!(await Hash.verify(user.password, password))) {
        return response.status(401).json({
          message: 'Invalid email or password',
        })
      }

      const token = await auth.use('api').generate(user, {
        expiresIn: '3 hours',
      })
      return response.status(200).json({
        code: '200',
        message: 'login success',
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      return response.status(404).json({
        code: '404',
        message: error,
      })
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()

    return response.status(200).json({
      message: 'Logout success',
    })
  }

  public async getRole(user) {
    const userID = user.id
    var roleID = await Database.rawQuery(
      'SELECT role FROM `roles` WHERE roles.id IN (SELECT id_role FROM user_roles where id_user = :user);',
      {
        user: userID,
      }
    )

    const role = roleID[0][0]['role']

    return role
  }
}
