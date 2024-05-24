import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    await User.createMany([
      {
        username: 'Admin',
        email: 'admin@srirejeki.com',
        password: await Hash.make('sriRejekiStrongP4$$w0rd'),
        phone: '628123123123',
        first_name: 'admin',
        last_name: 'admin',
        role: role.admin
      },
      {
        username: 'User',
        email: 'user@srirejeki.com',
        password: await Hash.make('password'),
        phone: '628123123123',
        first_name: 'user',
        last_name: 'user',
        role: role.user
      },
    ])
  }
}
enum role {
  admin = "admin",
  user = "user"
}
