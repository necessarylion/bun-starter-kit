import { DateTime } from "luxon"
import { TypeLoaderFn } from "openapi-metadata"

export const LuxonTypeLoader: TypeLoaderFn = async (_context, value) => {
	if (value === DateTime) {
		return { type: "string" }
	}
}
