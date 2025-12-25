import type { Knex } from "knex"

const databaseUrl = process.env.DATABASE_URL || ""

// Determine client based on DATABASE_URL protocol
const isSqlite = databaseUrl.startsWith("sqlite://")

const config: Knex.Config = {
	client: isSqlite ? "sqlite3" : "mysql2",
	connection: isSqlite
		? {
				filename: databaseUrl.replace("sqlite://", ""),
			}
		: databaseUrl,
	pool: isSqlite ? undefined : { min: 1, max: 10 },
	useNullAsDefault: isSqlite,
}

module.exports = config
