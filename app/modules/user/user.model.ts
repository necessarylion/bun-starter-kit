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

	@ApiProperty({ example: "john.doe@example.com" })
	@column()
	email!: string

	@ApiProperty({ example: "securePassword123" })
	@column()
	password!: string

	@ApiProperty({ example: "https://example.com/avatar.jpg" })
	@column()
	avatar!: string

	@ApiProperty({ example: "2024-01-01T12:00:00Z" })
	@column.dateTime()
	createdAt!: DateTime

	@ApiProperty({ example: "2024-01-02T12:00:00Z" })
	@column.dateTime()
	updatedAt!: DateTime | null

	@ApiProperty({ type: () => [Post] })
	@hasMany(() => Post)
	posts!: HasMany<typeof Post>
}
