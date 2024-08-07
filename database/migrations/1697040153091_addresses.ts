import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('label').notNullable()
      table.string('name').notNullable()
      table.string('phone').notNullable()
      table.string('jalan').notNullable()
      table.string('kelurahan').notNullable()
      table.string('kecamatan').notNullable()
      table.string('kota').notNullable()
      table.string('provinsi').notNullable()
      table.string('kode_pos').notNullable()
      table.boolean('selected').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.datetime('created_at', { useTz: true })
      table.datetime('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
