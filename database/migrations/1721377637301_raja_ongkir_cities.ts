import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RajaOngkirCities extends BaseSchema {
  protected tableName = 'raja_ongkir_cities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').unsigned().notNullable().primary()
      table.string('name').notNullable()
      table
        .integer('province_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('raja_ongkir_provinces')
        .onDelete('CASCADE')
      table.string('type').notNullable()
      table.integer('postal').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
