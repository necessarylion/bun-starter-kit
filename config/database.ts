import { defineConfig } from "@adonisjs/lucid"
// @ts-expect-error
import config from "@/knexfile"

export default defineConfig({
	connection: "database",
	connections: {
		database: {
			...config,
			debug: false,
		},
	},
})
