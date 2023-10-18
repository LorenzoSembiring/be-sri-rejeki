import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await User.create(
      {
        username: 'Admin',
        email: 'admin@srirejeki.com',
        password: await Hash.make('sriRejekiStrongP4$$w0rd'),
        phone: '628123123123',
        first_name: 'admin',
        last_name: 'admin'
      }
    )
  }
}
