import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public label: string

  @column()
  public name: string

  @column()
  public phone: string

  @column()
  public jalan: string

  @column()
  public kelurahan: string

  @column()
  public kecamatan: string

  @column()
  public kota: string

  @column()
  public provinsi: string

  @column()
  public kode_pos: number

  @column()
  public selected: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
