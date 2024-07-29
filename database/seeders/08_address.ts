import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Address from 'App/Models/Address'

export default class extends BaseSeeder {
  public async run () {
    await Address.create({
      user_id: 2,
      label: "rumah",
      name: "Ahmad",
      phone: "081234567890",
      jalan: "Empu Gandring",
      kelurahan: "KATERUNGAN",
      kecamatan: "KRIAN",
      kota: "KABUPATEN SIDOARJO",
      provinsi: "JAWA TIMUR",
      kode_pos: 61262,
      selected: true
  })
  }
}
