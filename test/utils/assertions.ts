import { expect } from "bun:test"
import type { AxiosResponse } from "axios"

/**
 * Assert that a response has a validation error (422 status)
 * Optionally check for a specific field error
 */
export const expectValidationError = (
	response: AxiosResponse,
	field?: string,
) => {
	expect(response.status).toBe(422)
	expect(response.data).toHaveProperty("errors")
	expect(response.data.errors).toBeDefined()

	if (field) {
		expect(
			Array.isArray(response.data.errors) ||
				typeof response.data.errors === "object",
		).toBe(true)
		// Check if field exists in errors (works for both array and object formats)
		const hasField = Array.isArray(response.data.errors)
			? response.data.errors.some((e: any) => e.field === field)
			: response.data.errors[field] !== undefined
		expect(hasField).toBe(true)
	}
}

/**
 * Assert that a response is successful (2xx status)
 */
export const expectSuccess = (response: AxiosResponse) => {
	expect(response.status).toBeGreaterThanOrEqual(200)
	expect(response.status).toBeLessThan(300)
}

/**
 * Assert that a response has specific status code
 */
export const expectStatus = (response: AxiosResponse, status: number) => {
	expect(response.status).toBe(status)
}

/**
 * Assert that response data has specific properties
 */
export const expectProperties = (data: any, properties: string[]) => {
	for (const prop of properties) {
		expect(data).toHaveProperty(prop)
	}
}

/**
 * Measure response time of an async operation
 */
export const measureResponseTime = async <T>(
	fn: () => Promise<T>,
): Promise<{ result: T; duration: number }> => {
	const start = performance.now()
	const result = await fn()
	const duration = performance.now() - start
	return { result, duration }
}
