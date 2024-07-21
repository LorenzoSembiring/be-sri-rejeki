import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import axios from 'axios';

export default class RajaOngkirsController {
  public async saveProvinces() {
    try {
      const response = await axios.get(
        'https://api.rajaongkir.com/starter/province',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'key': process.env.RAJA_ONGKIR_KEY,
          },
        }
      );

      const provinceData = response.data.rajaongkir.results;

      for (const province of provinceData) {
        await Database.rawQuery(
          'INSERT INTO `raja_ongkir_provinces` (`id`, `name`) VALUES (:id, :name)',
          {
            id: province.province_id,
            name: province.province,
          }
        );
      }
      console.log('Provinces have been added to the database');
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }
  public async saveCities() {
    try {
      const response = await axios.get(
        'https://api.rajaongkir.com/starter/city',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'key': process.env.RAJA_ONGKIR_KEY,
          },
        }
      );

      const cityData = response.data.rajaongkir.results;

      for (const city of cityData) {
        await Database.rawQuery(
          'INSERT INTO `raja_ongkir_cities` (`id`, `name`, `province_id`, `type`, `postal`) VALUES (:id, :name, :province_id, :type, :postal)',
          {
            id: city.city_id, // Ensure these fields match the API response
            name: city.city_name,
            province_id: city.province_id,
            type: city.type,
            postal: city.postal_code,
          }
        );
      }

      console.log('Cities have been added to the database');
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }
  public async getCost({ request, response }: HttpContextContract) {
    const { origin, destination, weight } = request.body()
    const destinationID = await this.getCityID(destination)
    var data: string[] = [];
    const courier = ["jne","pos","tiki"]
    try {
      for (let index = 0; index < 3; index++) {
        const formData = new FormData();
        formData.append("origin", origin);
        formData.append("destination", destinationID.id );
        formData.append("weight", weight);
        formData.append("courier", courier[index]);

        var getCost = await axios.post(
          '	https://api.rajaongkir.com/starter/cost',
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'key': process.env.RAJA_ONGKIR_KEY,
            },
          }
        );
        data.push(getCost.data.rajaongkir.results[0])
      }

      return response.status(200).json({
        code: 200,
        status: "success",
        data: data
      })

    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: "fail",
        error: error.message
      })
    }
  }
  private async getCityID(city: string) {
    const words: string[] = city.split(' ');
    const result: string = words.slice(1).join(' ');
    try{
      const data = await Database.rawQuery(
        'SELECT id from raja_ongkir_cities WHERE name LIKE :city;',
        {
          city: result
        }
      )
      return data[0][0]
    } catch(error) {
      return null
    }
  }
}
