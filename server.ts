import "reflect-metadata"
import "@/utils/sentry"
import "@/utils/vine/example"
import { logger } from "@sentry/bun"
import { env } from "bun"
import { Hono } from "hono"
import errorHandler from "@/app/error-handler"
import api from "@/routes/api"
import openapi from "@/routes/openapi"
import web from "@/routes/web"
import { vineValidation } from "./app/middleware/vine_validation_middleware"
import { version } from "./package.json"
import { runMigration } from "./utils/migration"

logger.info(`App environment: ${env.APP_ENV}`)
logger.info(`Version: ${version}`)

await runMigration()

const app = new Hono()
app.use(vineValidation)
app.route("/", web)
app.route("/", api)
app.route("/", openapi)
app.onError(errorHandler)

export default {
	port: env.PORT || 3000,
	fetch: app.fetch,
}
