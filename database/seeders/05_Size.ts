import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Size from 'App/Models/Size'

export default class extends BaseSeeder {
  public async run () {
    await Size.createMany([
      {
        product_id: 1,
        size: 6,
        stock: 100
      },
      {
        product_id: 1,
        size: 7,
        stock: 100
      },
      {
        product_id: 2,
        size: 6,
        stock: 100
      },
      {
        product_id: 2,
        size: 7,
        stock: 100
      },
      {
        product_id: 3,
        size: 6,
        stock: 100
      },
      {
        product_id: 3,
        size: 7,
        stock: 100
      },
    ])
  }
}
