import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('kurir').notNullable()
      table.string('type_kurir').notNullable()
      table.integer('ongkir').notNullable()
      table.string('resi').notNullable()
      table.string('midtrans_id').notNullable()
      table.string('midtrans_token').notNullable()
      table.datetime('date').notNullable()
      table.string('status').notNullable()
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
