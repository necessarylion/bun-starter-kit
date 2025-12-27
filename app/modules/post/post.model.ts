import { column } from "@adonisjs/lucid/orm"
import { DateTime } from "luxon"
import { ApiProperty } from "openapi-metadata/decorators"
import { Model } from "@/utils/lucid"

export default class Post extends Model {
	@ApiProperty()
	@column({ isPrimary: true })
	id!: number

	@ApiProperty({ example: "My First Post" })
	@column()
	title!: string

	@ApiProperty({ example: "This is the content of my first post." })
	@column()
	content!: string

	@ApiProperty({ example: 1 })
	@column()
	userId!: number

	@ApiProperty({ example: "2024-01-01T12:00:00Z" })
	@column.dateTime()
	createdAt!: DateTime

	@ApiProperty({ example: "2024-01-02T12:00:00Z" })
	@column.dateTime()
	updatedAt!: DateTime | null
}
