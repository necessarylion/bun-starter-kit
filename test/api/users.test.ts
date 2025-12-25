import { describe, expect, test } from "bun:test"
import {
	createFormData,
	createImageFile,
	createUserData,
} from "../utils/factories"
import { http } from "../utils/http-client"
import "../utils/setup"

describe("User API", () => {
	describe("GET /api/users", () => {
		test("should return list of users", async () => {
			const response = await http.get("/api/users")

			expect(response.status).toBe(200)

			const data = await response.json()
			expect(Array.isArray(data)).toBe(true)
		})

		test("should return users with posts preloaded", async () => {
			const response = await http.get("/api/users")
			const data = await response.json()

			if (data.length > 0) {
				expect(data[0]).toHaveProperty("posts")
			}
		})
	})

	describe("POST /api/users", () => {
		test("should create a new user with valid data", async () => {
			const userData = createUserData()
			const avatar = createImageFile()

			const formData = createFormData({
				...userData,
				avatar,
			})

			const response = await http.postForm("/api/users", formData)

			expect(response.status).toBe(200)

			const data = await response.json()
			expect(data).toHaveProperty("id")
			expect(data.name).toBe(userData.name)
			expect(data.email).toBe(userData.email)
			expect(data).toHaveProperty("avatar")
		})

		test("should return 422 when name is missing", async () => {
			const userData = createUserData({ name: undefined })
			const avatar = createImageFile()

			const formData = createFormData({
				...userData,
				avatar,
			})

			const response = await http.postForm("/api/users", formData)

			expect(response.status).toBe(422)

			const data = await response.json()
			expect(data).toHaveProperty("errors")
			expect(data.errors).toBeDefined()
		})

		test("should return 422 when email is invalid", async () => {
			const userData = createUserData({ email: "invalid-email" })
			const avatar = createImageFile()

			const formData = createFormData({
				...userData,
				avatar,
			})

			const response = await http.postForm("/api/users", formData)

			expect(response.status).toBe(422)

			const data = await response.json()
			expect(data).toHaveProperty("errors")
			expect(data.errors).toBeDefined()
			expect(
				Array.isArray(data.errors) || typeof data.errors === "object",
			).toBe(true)
		})

		test("should return 422 when password is too short", async () => {
			const userData = createUserData({
				password: "short",
				password_confirmation: "short",
			})
			const avatar = createImageFile()

			const formData = createFormData({
				...userData,
				avatar,
			})

			const response = await http.postForm("/api/users", formData)

			expect(response.status).toBe(422)

			const data = await response.json()
			expect(data).toHaveProperty("errors")
			expect(data.errors).toBeDefined()
		})

		test("should return 422 when password confirmation does not match", async () => {
			const userData = createUserData({
				password: "password123",
				password_confirmation: "different-password",
			})
			const avatar = createImageFile()

			const formData = createFormData({
				...userData,
				avatar,
			})

			const response = await http.postForm("/api/users", formData)

			expect(response.status).toBe(422)

			const data = await response.json()
			expect(data).toHaveProperty("errors")
			expect(data.errors).toBeDefined()
		})

		test("should return 422 when avatar is missing", async () => {
			const userData = createUserData()

			const formData = createFormData(userData)

			const response = await http.postForm("/api/users", formData)

			expect(response.status).toBe(422)

			const data = await response.json()
			expect(data).toHaveProperty("errors")
			expect(data.errors).toBeDefined()
		})

		test("should return 422 when avatar has invalid mime type", async () => {
			const userData = createUserData()

			// Create a text file instead of an image
			const textFile = new File(["test content"], "test.txt", {
				type: "text/plain",
			})

			const formData = createFormData({
				...userData,
				avatar: textFile,
			})

			const response = await http.postForm("/api/users", formData)

			expect(response.status).toBe(422)

			const data = await response.json()
			expect(data).toHaveProperty("errors")
			expect(data.errors).toBeDefined()
		})
	})
})
