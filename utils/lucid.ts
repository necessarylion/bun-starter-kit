/**
 * references from
 * https://github.com/adonisjs/lucid/issues/493
 */
import { EventEmitter } from "node:events"
import { Logger } from "@adonisjs/logger"
import { Database } from "@adonisjs/lucid/database"
import {
	Adapter,
	BaseModel,
	SnakeCaseNamingStrategy,
} from "@adonisjs/lucid/orm"
import { DatabaseConfig } from "@adonisjs/lucid/types/database"
import { snakeCase } from "lodash"
import databaseConfig from "@/config/database"

class SimpleEventEmitter extends EventEmitter {
	hasListeners = (eventName: string) => this.listenerCount(eventName) > 0
}

class DefaultNamingStrategy extends SnakeCaseNamingStrategy {
	serializedName(_model: typeof BaseModel, propertyName: string) {
		return snakeCase(propertyName)
	}
}

export class Lucid {
	public db: Database

	public Model: typeof BaseModel

	constructor(dbConfig: DatabaseConfig) {
		const logger = new Logger({ enabled: true })
		const emitter = new SimpleEventEmitter()
		this.db = new Database(dbConfig, logger, emitter as any)
		// for debugging
		emitter.on("db:query", (query) => {
			console.log(query)
		})
		this.Model = this.setupModel()
	}

	protected setupModel(): typeof BaseModel {
		BaseModel.$adapter = new Adapter(this.db)
		BaseModel.namingStrategy = new DefaultNamingStrategy()
		return BaseModel
	}
}

const lucid = new Lucid(databaseConfig)
const { Model } = lucid

export { lucid, Model }
