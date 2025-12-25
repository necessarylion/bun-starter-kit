import { logger } from "@sentry/bun"
import { env } from "bun"
import knex from "knex"
// @ts-expect-error
import config from "@/knexfile"

export const db = knex(config)

export async function runMigration() {
	if (env.NODE_ENV === "production" || env.NODE_ENV === "test") {
		try {
			logger.info("Running database migrations...")
			await db.migrate.latest()
			logger.info("Database migrated")
		} catch (error: any) {
			logger.error("Error running migrations:", { message: error.message })
		}
	}
}
