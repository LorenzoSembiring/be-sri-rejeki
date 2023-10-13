import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.create(
      {
        username: 'Admin',
        email: 'admin@srirejeki.com',
        password: 'sriRejekiStrongP4$$w0rd',
        phone: '628123123123',
        first_name: 'admin',
        last_name: 'admin'
      }
    )
  }
}
