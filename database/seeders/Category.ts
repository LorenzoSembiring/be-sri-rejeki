import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'

export default class extends BaseSeeder {
  public async run () {
    await Category.createMany([
      {
        name: "Kategori 1"
      },
      {
        name: "Kategori 2"
      }
    ])
  }
}
