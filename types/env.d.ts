declare global {
	namespace NodeJS {
		interface ProcessEnv {
			APP_ENV: string
			DATABASE_URL?: string
			SENTRY_DSN?: string
			SENTRY_TRACES_SAMPLE_RATE?: number
		}
	}
}

export {}
