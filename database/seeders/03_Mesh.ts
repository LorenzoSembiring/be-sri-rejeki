import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Mesh from 'App/Models/Mesh'

export default class extends BaseSeeder {
  public async run () {
    await Mesh.createMany([
      {
        name: "3D Blangkon Jogja",
        path: "mesh/bangkonjogha.glb"
      }
    ])
  }
}
