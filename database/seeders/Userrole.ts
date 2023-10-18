import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserRole from 'App/Models/UserRole'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await UserRole.create({
      id_user: 1,
      id_role: 1
    })
  }
}
