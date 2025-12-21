import { defineConfig } from "@adonisjs/lucid"
// @ts-expect-error
import config from "@/knexfile"

export default defineConfig({
	connection: "mysql",
	connections: {
		mysql: {
			...config,
			debug: false,
		},
	},
})
