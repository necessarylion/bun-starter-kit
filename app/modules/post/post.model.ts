import { column } from "@adonisjs/lucid/orm"
import { DateTime } from "luxon"
import { Model } from "@/utils/lucid"

export default class Post extends Model {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare title: string

	@column()
	declare content: string

	@column()
	declare userId: number

	@column.dateTime()
	declare createdAt: DateTime

	@column.dateTime()
	declare updatedAt: DateTime | null
}
