import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cart from 'App/Models/Cart'

export default class extends BaseSeeder {
  public async run () {
    await Cart.createMany([
      {
        user_id: 2,
        size_id: 1,
        quantity: 5,
        status: 'active'
      },
      {
        user_id: 2,
        size_id: 2,
        quantity: 5,
        status: 'active'
      },
      {
        user_id: 2,
        size_id: 3,
        quantity: 5,
        status: 'active'
      },
      {
        user_id: 2,
        size_id: 4,
        quantity: 5,
        status: 'active'
      }
    ])
  }
}
