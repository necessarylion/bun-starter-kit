import { column, hasMany } from "@adonisjs/lucid/orm"
import type { HasMany } from "@adonisjs/lucid/types/relations"
import { DateTime } from "luxon"
import { ApiProperty } from "openapi-metadata/decorators"
import { Model } from "@/utils/lucid"
import Post from "../post/post.model"

export default class User extends Model {
	@ApiProperty()
	@column({ isPrimary: true })
	id!: number

	@ApiProperty({ example: "John Doe" })
	@column()
	name!: string

	@column()
	email!: string

	@column()
	password!: string

	@column()
	avatar!: string

	@column.dateTime()
	createdAt!: DateTime

	@column.dateTime()
	updatedAt!: DateTime | null

	@hasMany(() => Post)
	posts!: HasMany<typeof Post>
}
