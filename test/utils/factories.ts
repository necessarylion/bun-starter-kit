import { randomUUIDv7 } from "bun"

export const createUserData = (overrides = {}) => {
	return {
		name: "Test User",
		email: `test-${randomUUIDv7()}@example.com`,
		password: "password123",
		password_confirmation: "password123",
		...overrides,
	}
}

export const createImageFile = (filename = "avatar.png") => {
	// Create a simple 1x1 PNG image
	const pngBuffer = Buffer.from([
		0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
		0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
		0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
		0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
		0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
		0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
	])

	const blob = new Blob([pngBuffer], { type: "image/png" })
	const file = new File([blob], filename, { type: "image/png" })

	return file
}

export const createFormData = (data: Record<string, unknown>) => {
	const formData = new FormData()

	for (const [key, value] of Object.entries(data)) {
		// Skip undefined and null values
		if (value === undefined || value === null) {
			continue
		}

		if (value instanceof File || value instanceof Blob) {
			formData.append(key, value)
		} else if (typeof value === "string" || typeof value === "number") {
			formData.append(key, value.toString())
		} else {
			formData.append(key, JSON.stringify(value))
		}
	}

	return formData
}
