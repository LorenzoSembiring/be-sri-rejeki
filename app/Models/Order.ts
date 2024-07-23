import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public kurir: string

  @column()
  public type_kurir: string

  @column()
  public ongkir: number

  @column()
  public resi: string

  @column()
  public midtrans_id: string

  @column.dateTime()
  public date: DateTime

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
