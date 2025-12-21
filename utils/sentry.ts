import * as Sentry from "@sentry/bun"
import { env } from "bun"
import { version } from "../package.json"

const colors: Record<string, string> = {
	error: "\x1b[31m",
	fatal: "\x1b[33m",
	info: "\x1b[34m",
	debug: "\x1b[32m",
	trace: "\x1b[0m",
	warn: "\x1b[35m",
}

// Ensure to call this before importing any other modules!
Sentry.init({
	environment: env.APP_ENV || "development",

	release: `v${version}`,

	dsn: env.SENTRY_DSN,

	sendDefaultPii: true,

	tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,

	enableLogs: true,

	beforeSendLog: (log) => {
		console.log(
			`${colors[log.level as string]}[${log.level.toUpperCase()}]\x1b[0m`,
			log.message,
			log.attributes?.error || "",
		)
		return log
	},
})
