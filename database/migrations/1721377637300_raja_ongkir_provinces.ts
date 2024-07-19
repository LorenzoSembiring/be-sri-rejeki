import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RajaOngkirProvinces extends BaseSchema {
  protected tableName = 'raja_ongkir_provinces'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').unsigned().notNullable().primary()
      table.string('name').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
