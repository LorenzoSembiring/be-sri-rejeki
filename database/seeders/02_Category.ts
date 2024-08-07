import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'

export default class extends BaseSeeder {
  public async run () {
    await Category.createMany([
      {
        name: "Blangkon Jogja"
      },
      {
        name: "Blangkon Jawa Tengah"
      },
      {
        name: "Blangkon Jawa Timur"
      },
      {
        name: "Udeng Bali"
      },
    ])
  }
}
