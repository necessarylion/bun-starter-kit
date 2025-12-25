import { afterAll, afterEach, beforeAll, beforeEach } from "bun:test"
import { lucid } from "@/utils/lucid"
import { runMigration } from "@/utils/migration"

beforeAll(async () => {
	// Run migrations before all tests
	await runMigration()
})

beforeEach(async () => {
	// Start a transaction before each test
	await lucid.db.beginGlobalTransaction()
})

afterEach(async () => {
	// Rollback transaction after each test
	await lucid.db.rollbackGlobalTransaction()
})

afterAll(async () => {
	// Close database connection
	await lucid.db.manager.closeAll()
})

export { lucid }
