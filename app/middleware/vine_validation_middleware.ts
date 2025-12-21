import type { VineValidator } from "@vinejs/vine"
import type { SchemaTypes, ValidationOptions } from "@vinejs/vine/types"
import type { Context, Next } from "hono"

export const vineValidation = async (
	{ req }: Context,
	next: Next,
): Promise<void> => {
	// Attach validate method to the context
	;(req as any).validate = async <T>(
		validator: VineValidator<SchemaTypes, any>,
		options: ValidationOptions<Record<string, any>> | undefined = undefined,
	): Promise<T> => {
		// Read JSON body from the request
		let jsonBody: Record<string, any> = {}
		const formData: Record<string, any> = {}

		if (req.header("content-type")?.includes("application/json")) {
			jsonBody = await req.json()
		}

		if (req.header("content-type")?.includes("multipart/form-data")) {
			const form = await req.formData()
			for (const [key, value] of form.entries()) {
				formData[key] = value
			}
		}

		const params = req.queries()
		const payload = {
			...params,
			...jsonBody,
			...formData,
		}
		// Run VineJS validation
		const result = await validator.validate(payload, options)

		return result as T
	}

	// Continue to next middleware / handler
	await next()
}
