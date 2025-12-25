import { afterAll, afterEach, beforeAll, beforeEach } from "bun:test"
import server from "@/server"
import { lucid } from "@/utils/lucid"

let testServer: ReturnType<typeof Bun.serve> | null = null

beforeAll(() => {
	// Start test server
	testServer = Bun.serve(server)
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
	// Stop test server
	if (testServer) {
		testServer.stop()
	}
	// Close database connection
	await lucid.db.manager.closeAll()
})

export { lucid }
