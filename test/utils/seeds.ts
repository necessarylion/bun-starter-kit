import { createFormData, createImageFile, createUserData } from "./factories"
import { http } from "./http-client"

/**
 * Seed a user in the database
 * Returns the created user data
 */
export const seedUser = async (overrides = {}) => {
	const userData = createUserData(overrides)
	const avatar = createImageFile()

	const formData = createFormData({
		...userData,
		avatar,
	})

	const response = await http.post("/api/users", formData)

	if (response.status !== 200) {
		throw new Error(`Failed to seed user: ${JSON.stringify(response.data)}`)
	}

	return response.data
}

/**
 * Seed multiple users in the database
 * Returns array of created user data
 */
export const seedUsers = async (count: number, overrides = {}) => {
	const users = []

	for (let i = 0; i < count; i++) {
		const user = await seedUser(overrides)
		users.push(user)
	}

	return users
}
