import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Picture extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public product_id: number

  @column()
  public index: number

  @column()
  public path: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
