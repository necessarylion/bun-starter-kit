import { column, hasMany } from "@adonisjs/lucid/orm"
import type { HasMany } from "@adonisjs/lucid/types/relations"
import { DateTime } from "luxon"
import { Model } from "@/utils/lucid"
import Post from "../post/post.model"

export default class User extends Model {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare name: string

	@column()
	declare email: string

	@column()
	declare password: string

	@column()
	declare avatar: string

	@column.dateTime()
	declare createdAt: DateTime

	@column.dateTime()
	declare updatedAt: DateTime | null

	@hasMany(() => Post)
	declare posts: HasMany<typeof Post>
}
