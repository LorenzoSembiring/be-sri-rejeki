import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Picture from 'App/Models/Picture'

export default class extends BaseSeeder {
  public async run () {
    await Picture.createMany([
      {
        product_id: 1,
        index: 1,
        path: "/uploads/picture/blangkon-solo.jpg"
      },
      {
        product_id: 2,
        index: 1,
        path: "/uploads/picture/blangkon-kuning.jpg"
      },
      {
        product_id: 3,
        index: 1,
        path: "/uploads/picture/blangkon-jogja.jpg"
      }
    ])
  }
}
