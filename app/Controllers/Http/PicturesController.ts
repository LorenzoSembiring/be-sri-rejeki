import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import ProductsController from './ProductsController'
import Picture from 'App/Models/Picture'
import Drive from '@ioc:Adonis/Core/Drive'

export default class PicturesController {
  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const { product_id, index } = request.body();

      const usersController = new UsersController();
      const user = await auth.authenticate();
      const role = await usersController.getRole(user);

      const productController = new ProductsController();
      const product = await productController.checkProduct(product_id);

      if (role == "admin") {
        if (product) {
          const file = request.file('file', {
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg'],
          });

          if (file) {
            await file.moveToDisk('./picture');
            const fileName = file.fileName;

            await Picture.create({
              product_id: product_id,
              index: index,
              path: "/uploads/picture/" + fileName,
            });

            return response.status(201).json({
              code: 201,
              status: "created",
              data: { product_id, index, path: fileName },
            });
          } else {
            return response.status(400).json({
              code: 400,
              status: "bad request",
              message: "No file uploaded",
            });
          }
        } else {
          return response.status(404).json({
            code: 404,
            status: "not found",
            message: "Product not found",
          });
        }
      } else {
        return response.status(401).json({
          code: 401,
          status: "Unauthorized",
          message: "Your role access is not sufficient for this action",
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        code: 500,
        status: "fail",
        message: error.message || "Internal Server Error",
      });
    }
  }

  public async index({ params, response }: HttpContextContract) {
    try {

      const picture = await Picture.query().where("product_id", params.id)

      if(picture.length != 0) {
        return response.status(200).json({
          code: 200,
          status: "success",
          data: picture
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: "not found",
          message: "Picture to correspond product not found!"
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

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      const { product_id, index } = request.body();

      const usersController = new UsersController();
      const user = await auth.authenticate();
      const role = await usersController.getRole(user);

      if (role !== 'admin') {
        return response.status(401).json({
          code: 401,
          status: "Unauthorized",
          message: "Your role access is not sufficient for this action",
        });
      }

      const productController = new ProductsController();
      const product = await productController.checkProduct(product_id);

      if (!product) {
        return response.status(404).json({
          code: 404,
          status: "not found",
          message: "Product not found",
        });
      }

      const picture = await Picture.query().where('product_id', product_id).andWhere('index', index).first();

      if (!picture) {
        return response.status(404).json({
          code: 404,
          status: "not found",
          message: `Picture not found for product ID ${product_id} and index ${index}`,
        });
      }

      const file = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      });

      if (!file) {
        return response.status(400).json({
          code: 400,
          status: "bad request",
          message: "No file uploaded",
        });
      }

      // Remove the old picture file if it exists
      // const oldFilePath = picture.path;
      await Drive.delete(picture.path);

      await file.moveToDisk('./picture');
      const fileName = file.fileName;

      picture.merge({
        product_id,
        index,
        path: `/uploads/picture/${fileName}`,
      });

      await picture.save();

      return response.status(200).json({
        code: 200,
        status: "updated",
        data: { product_id, index, path: fileName },
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        code: 500,
        status: "fail",
        message: error.message || "Internal Server Error",
      });
    }
  }
  public async destroy({ params, response, auth }: HttpContextContract) {
    try {

      const usersController = new UsersController()
      const user = await auth.authenticate()
      const role = await usersController.getRole(user)
      const picture = await this.getPath(user, params.id)

      if (role == "admin") {
        if (picture) {

          await Drive.delete(picture.path)
          await picture.delete()

          return response.status(200).json({
            code: 200,
            status: "success",
            message: "Picture removed successfully!"
          })

        } else {

          return response.status(404).json({
            code: 404,
            status: "not found",
            message: "Picture not found"
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
        message: error,

      })
    }
  }

  private async getPath(user, id) {

    const usersController = new UsersController()
    const role = await usersController.getRole(user)

    try {
      if(role =="admin"){

        const picture = await Picture.find(id)

        if (picture) {
          return picture
        } else {
          return null
        }
      }
    } catch (error) {
      return null
    }
  }
}
