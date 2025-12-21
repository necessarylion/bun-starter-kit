import type { Knex } from "knex"

const config: Knex.Config = {
	client: "mysql2",
	connection: process.env.DATABASE_URL,
	pool: { min: 1, max: 10 },
}

module.exports = config
