import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import RajaOngkirsController from 'App/Controllers/Http/RajaOngkirsController';

export default class extends BaseSeeder {
  public async run () {
    const rajaOngkirsController = new RajaOngkirsController();
    await rajaOngkirsController.saveProvinces();
    await rajaOngkirsController.saveCities();
  }
}
