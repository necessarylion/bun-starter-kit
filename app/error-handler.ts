import { errors } from "@vinejs/vine"
import type { Context } from "hono"

export default function errorHandler(err: Error, c: Context) {
	// validation error
	if (err instanceof errors.E_VALIDATION_ERROR) {
		return c.json(
			{
				success: false,
				message: err.message,
				errors: err.messages,
			},
			422,
		)
	}

	// all other errors
	return c.json(
		{
			success: false,
			message: err.message || "Internal server error",
		},
		500,
	)
}
