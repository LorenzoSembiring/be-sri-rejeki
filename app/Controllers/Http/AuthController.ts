import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async check({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.check()
      if(user){
        return response.status(200).json({
          code: 200,
          message: "Token valid"
        })
      } else if(!user) {
        return response.status(400).json({
          code: 400,
          message: "Token invalid"
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: error
      })
    }
  }

  public async userByAuth({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      return response.status(200).json({
        code: 200,
        data: user
      })
    } catch (error) {
      if (error.responseText == "E_INVALID_API_TOKEN: Invalid API token") {
        return response.status(401).json({
          code: 401,
          message: "Token Invalid"
        })

      } else {
        return response.status(500).json({
          code: 500,
          message: "Error"
        })
      }
    }
  }
}
